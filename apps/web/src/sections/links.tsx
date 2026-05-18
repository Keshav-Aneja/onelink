import { useAppDispatch, useAppSelector } from "@store/store";
import type { Link } from "@onelink/entities/models";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStoredLinks } from "@hooks/links";
import { useViewPreferences } from "@hooks/view-preferences";
import LinkCard from "@components/cards/link-card";
import LinkListItem from "@components/cards/link-list-item";
import LinkCompactItem from "@components/cards/link-compact-item";
import ViewToolbar from "@components/toolbar/view-toolbar";
import { useLinks } from "@features/links/get-links";
import { addMultipleLinks } from "@store/slices/links-slice";
import LinkCardSuspense from "@components/cards/link-card-suspense";
import Mascot from "@components/mascot";
import { useStoredCollections } from "@hooks/collections";
import { getSecuredCollection } from "@store/slices/application-slice";
import {
  filterLinks,
  sortLinks,
  groupLinksByDomain,
  filterLinksByTags,
} from "@lib/utils/link-view";
import { useSettings } from "@features/settings/get-settings";
import getFaviconUrl from "@lib/utils/get-favicon-url";
import {
  clearSelection,
  getSelectedIds,
  selectAll,
  setRangeSelection,
  toggleSelection,
  removeFromSelection,
} from "@store/slices/selection-slice";
import BulkActionBar from "@components/bulk/bulk-action-bar";
import { BulkMoveModal } from "@components/bulk/bulk-move-modal";
import { BulkTagPopover } from "@components/bulk/bulk-tag-popover";
import { useBulkDeleteLinks, useBulkUpdateLinks } from "@features/links/bulk-links";
import { useBulkApplyTags } from "@features/tags/bulk-tags";
import { useToast } from "@components/ui/toast";

interface LinksContent {
  pathId: string | null;
}

const DENSITY_CONFIG: Record<number, { gridClass: string; cardHeight: string }> = {
  3: { gridClass: "grid-cols-2 md:grid-cols-3", cardHeight: "25rem" },
  4: { gridClass: "grid-cols-2 md:grid-cols-4", cardHeight: "20rem" },
  5: { gridClass: "grid-cols-2 md:grid-cols-5", cardHeight: "17rem" },
  6: { gridClass: "grid-cols-2 md:grid-cols-6", cardHeight: "15rem" },
};

interface LinkGroupProps {
  links: Link[];
  viewMode: "grid" | "list" | "compact";
  gridClass: string;
  cardHeight: string;
  showOgImage: boolean;
  selectedIds: string[];
  onSelectLink: (id: string, e: React.MouseEvent) => void;
  selectionMode: boolean;
}

function LinkGroup({
  links,
  viewMode,
  gridClass,
  cardHeight,
  showOgImage,
  selectedIds,
  onSelectLink,
  selectionMode,
}: LinkGroupProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  if (viewMode === "grid") {
    return (
      <div className={`w-full grid ${gridClass}`}>
        {links.map((link, i) => (
          <LinkCard
            data={link}
            key={link.id}
            height={cardHeight}
            index={i}
            showOgImage={showOgImage}
            isSelected={selectedSet.has(link.id)}
            onSelect={selectionMode ? (e) => onSelectLink(link.id, e) : undefined}
          />
        ))}
      </div>
    );
  }
  if (viewMode === "list") {
    return (
      <div className="w-full flex flex-col border border-white/8 rounded-md overflow-hidden">
        {links.map((link) => (
          <LinkListItem
            data={link}
            key={link.id}
            isSelected={selectedSet.has(link.id)}
            onSelect={selectionMode ? (e) => onSelectLink(link.id, e) : undefined}
          />
        ))}
      </div>
    );
  }
  // compact
  return (
    <div className="w-full flex flex-col border border-white/8 rounded-md overflow-hidden">
      {links.map((link) => (
        <LinkCompactItem
          data={link}
          key={link.id}
          isSelected={selectedSet.has(link.id)}
          onSelect={selectionMode ? (e) => onSelectLink(link.id, e) : undefined}
        />
      ))}
    </div>
  );
}

const LinksContent = ({ pathId }: LinksContent) => {
  const collections = useStoredCollections(pathId);
  const links = useStoredLinks(pathId);
  const dispatch = useAppDispatch();
  const securedCollections = useAppSelector(getSecuredCollection);
  const { prefs, updatePrefs } = useViewPreferences(pathId);
  const { data: settingsData } = useSettings();
  const showOgImage = settingsData?.data?.show_og_image ?? true;
  const { showToast } = useToast();

  const selectedIds = useAppSelector(getSelectedIds);
  const [selectionMode, setSelectionMode] = useState(false);
  const [anchorId, setAnchorId] = useState<string | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showTagPopover, setShowTagPopover] = useState(false);

  // Exit selection mode and clear when navigating away
  useEffect(() => {
    dispatch(clearSelection());
    setSelectionMode(false);
    setAnchorId(null);
  }, [pathId, dispatch]);

  // Auto-enter selection mode when something gets selected
  useEffect(() => {
    if (selectedIds.length > 0) setSelectionMode(true);
  }, [selectedIds.length]);

  // Fetch only when Redux cache is empty for this path
  const shouldFetch = !links || links.length === 0;
  const linkQuery = useLinks(shouldFetch, pathId);

  useEffect(() => {
    if (linkQuery.isSuccess && linkQuery.data?.data && shouldFetch) {
      dispatch(addMultipleLinks(linkQuery.data.data));
    }
  }, [linkQuery.isSuccess, linkQuery.data, shouldFetch, dispatch]);

  const availableTags = useMemo(() => {
    if (!links) return [];
    const tagSet = new Set<string>();
    links.forEach((l) =>
      l.tags?.forEach((t) => {
        if (t.confirmed) tagSet.add(t.name);
      }),
    );
    return Array.from(tagSet).sort();
  }, [links]);

  const processedLinks = useMemo(() => {
    if (!links) return [];
    const filtered = filterLinks(links, prefs.filterBy);
    const tagFiltered = filterLinksByTags(filtered, prefs.tagFilter ?? []);
    return sortLinks(tagFiltered, prefs.sortBy);
  }, [links, prefs.filterBy, prefs.sortBy, prefs.tagFilter]);

  const groupedLinks = useMemo(() => {
    if (!prefs.groupByDomain) return null;
    const byDomain = groupLinksByDomain(processedLinks);
    return Object.entries(byDomain).sort(([, a], [, b]) => b.length - a.length);
  }, [processedLinks, prefs.groupByDomain]);

  const { gridClass, cardHeight } = DENSITY_CONFIG[prefs.gridDensity] ?? DENSITY_CONFIG[6];

  // Flat ordered list for range selection
  const flatOrderedIds = useMemo(
    () => processedLinks.map((l) => l.id),
    [processedLinks],
  );

  // Bulk mutations
  const bulkDelete = useBulkDeleteLinks({
    mutationConfig: {
      onSuccess: (data) => {
        const deleted = data.data.ids;
        dispatch(removeFromSelection(deleted));
        showToast(`Deleted ${deleted.length} link${deleted.length !== 1 ? "s" : ""}`);
        if (deleted.length === selectedIds.length) {
          dispatch(clearSelection());
          setSelectionMode(false);
        }
      },
    },
  });

  const bulkUpdate = useBulkUpdateLinks({
    mutationConfig: {
      onSuccess: () => {
        setShowMoveModal(false);
        setShowTagPopover(false);
      },
    },
  });

  const bulkApplyTags = useBulkApplyTags({
    mutationConfig: {
      onSuccess: (data) => {
        const { added, removed } = data.data;
        const parts = [];
        if (added.length > 0) parts.push(`added: ${added.join(", ")}`);
        if (removed.length > 0) parts.push(`removed: ${removed.join(", ")}`);
        showToast(`Tags updated — ${parts.join(" · ")}`);
        setShowTagPopover(false);
      },
    },
  });

  // Selection handler — handles shift-click range and cmd/ctrl toggle
  const handleSelectLink = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.shiftKey && anchorId) {
        const anchorIdx = flatOrderedIds.indexOf(anchorId);
        const targetIdx = flatOrderedIds.indexOf(id);
        if (anchorIdx !== -1 && targetIdx !== -1) {
          const start = Math.min(anchorIdx, targetIdx);
          const end = Math.max(anchorIdx, targetIdx);
          const rangeIds = flatOrderedIds.slice(start, end + 1);
          dispatch(setRangeSelection({ ids: rangeIds, anchorId: id }));
          setAnchorId(id);
          return;
        }
      }
      dispatch(toggleSelection(id));
      setAnchorId(id);
    },
    [anchorId, flatOrderedIds, dispatch],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        if (processedLinks.length > 0) {
          dispatch(selectAll(flatOrderedIds));
          setSelectionMode(true);
        }
        return;
      }

      if (e.key === "Escape" && selectionMode) {
        dispatch(clearSelection());
        setSelectionMode(false);
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0 && !showMoveModal && !showTagPopover) {
          handleBulkDelete();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectionMode, selectedIds, flatOrderedIds, showMoveModal, showTagPopover, dispatch]);

  const toggleSelectionMode = () => {
    if (selectionMode) {
      dispatch(clearSelection());
      setSelectionMode(false);
    } else {
      setSelectionMode(true);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(
      `Delete ${selectedIds.length} link${selectedIds.length !== 1 ? "s" : ""}? This cannot be undone.`,
    );
    if (confirmed) {
      bulkDelete.mutate({ ids: selectedIds });
    }
  };

  const handleBulkStar = (star: boolean) => {
    if (selectedIds.length === 0) return;
    bulkUpdate.mutate(
      { ids: selectedIds, data: { is_starred: star } },
      {
        onSuccess: () => {
          showToast(`${star ? "Starred" : "Unstarred"} ${selectedIds.length} link${selectedIds.length !== 1 ? "s" : ""}`);
        },
      },
    );
  };

  const handleBulkMove = (targetId: string | null) => {
    if (selectedIds.length === 0) return;
    bulkUpdate.mutate(
      { ids: selectedIds, data: { parent_id: targetId } },
      {
        onSuccess: () => {
          showToast(`Moved ${selectedIds.length} link${selectedIds.length !== 1 ? "s" : ""}`);
          dispatch(clearSelection());
          setSelectionMode(false);
          setShowMoveModal(false);
        },
      },
    );
  };

  const handleBulkTag = (toAdd: string[], toRemove: string[]) => {
    if (toAdd.length === 0 && toRemove.length === 0) {
      setShowTagPopover(false);
      return;
    }
    bulkApplyTags.mutate({ link_ids: selectedIds, add: toAdd, remove: toRemove });
  };

  const handleCopyUrls = () => {
    if (!links) return;
    const selectedLinks = links.filter((l) => selectedIds.includes(l.id));
    const text = selectedLinks.map((l) => l.link).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${selectedLinks.length} URL${selectedLinks.length !== 1 ? "s" : ""} to clipboard`);
    });
  };

  if (linkQuery.isLoading) {
    return (
      <div className={`w-full grid ${gridClass} gap-3`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <LinkCardSuspense key={i} height={cardHeight} />
        ))}
      </div>
    );
  }

  if (
    (!links || links.length === 0) &&
    (!collections || collections.length === 0)
  ) {
    return <Mascot>No Collections or links found</Mascot>;
  }

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <div className="sticky top-0 z-10 bg-theme_primary_black pb-1">
        <ViewToolbar
          prefs={prefs}
          onUpdate={updatePrefs}
          linkCount={processedLinks.length}
          availableTags={availableTags}
          selectionMode={selectionMode}
          onToggleSelectionMode={toggleSelectionMode}
        />
      </div>

      {processedLinks.length === 0 && (
        <p className="text-sm text-white/30 py-6 text-center">
          No links match the current filter.
        </p>
      )}

      {groupedLinks ? (
        <div className="w-full flex flex-col gap-6">
          {groupedLinks.map(([domain, domainLinks]) => (
            <div key={domain} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={getFaviconUrl(domain)}
                  alt=""
                  width={14}
                  height={14}
                  className="opacity-60"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-xs font-medium text-white/50">{domain}</span>
                <span className="text-[0.6rem] text-white/25">
                  {domainLinks.length} {domainLinks.length === 1 ? "link" : "links"}
                </span>
                <div className="flex-1 h-px bg-white/8" />
              </div>
              <LinkGroup
                links={domainLinks}
                viewMode={prefs.viewMode}
                gridClass={gridClass}
                cardHeight={cardHeight}
                showOgImage={showOgImage}
                selectedIds={selectedIds}
                onSelectLink={handleSelectLink}
                selectionMode={selectionMode}
              />
            </div>
          ))}
        </div>
      ) : (
        <LinkGroup
          links={processedLinks}
          viewMode={prefs.viewMode}
          gridClass={gridClass}
          cardHeight={cardHeight}
          showOgImage={showOgImage}
          selectedIds={selectedIds}
          onSelectLink={handleSelectLink}
          selectionMode={selectionMode}
        />
      )}

      {/* Floating bulk action bar */}
      {selectedIds.length > 0 && (
        <BulkActionBar
          selectedIds={selectedIds}
          allLinks={links}
          onClear={() => { dispatch(clearSelection()); setSelectionMode(false); }}
          onDelete={handleBulkDelete}
          onStar={() => handleBulkStar(true)}
          onUnstar={() => handleBulkStar(false)}
          onMove={() => setShowMoveModal(true)}
          onTag={() => setShowTagPopover(true)}
          onCopyUrls={handleCopyUrls}
          isDeleting={bulkDelete.isPending}
          isUpdating={bulkUpdate.isPending || bulkApplyTags.isPending}
        />
      )}

      {showMoveModal && (
        <BulkMoveModal
          count={selectedIds.length}
          onClose={() => setShowMoveModal(false)}
          onMove={handleBulkMove}
          isPending={bulkUpdate.isPending}
        />
      )}

      {showTagPopover && (
        <BulkTagPopover
          selectedIds={selectedIds}
          allLinks={links}
          onClose={() => setShowTagPopover(false)}
          onApplyTags={handleBulkTag}
          isPending={bulkApplyTags.isPending}
        />
      )}
    </Fragment>
  );
};

export default LinksContent;
