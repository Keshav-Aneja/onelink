import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAppSelector } from "@store/store";
import { getAllCollections } from "@store/slices/collections-slice";
import { useUpdateLink } from "@features/links/update-link";
import type { Link, Collection } from "@onelink/entities/models";
import { cn } from "@lib/tailwind-utils";
import {
  BiSolidFolder,
  BiFolder,
  BiSearch,
  BiHome,
  BiChevronRight,
} from "react-icons/bi";
import { RiLoaderLine } from "react-icons/ri";

type Props = {
  link: Link;
  onClose: () => void;
};

type ViewMode = "browse" | "search";

export function MoveToCollectionModal({ link, onClose }: Props) {
  const allCollections = useAppSelector(getAllCollections);

  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null | "root">(
    link.parent_id ?? "root",
  );

  const updateLinkMutation = useUpdateLink({
    mutationConfig: {
      onSuccess: () => {
        onClose();
      },
    },
  });

  const visibleCollections = useMemo(
    () => allCollections.filter((c) => c.parent_id === currentParentId),
    [allCollections, currentParentId],
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allCollections.filter((c) => c.name.toLowerCase().includes(q));
  }, [allCollections, searchQuery]);

  const navigate = (collection: Collection) => {
    setBreadcrumbs((prev) => [...prev, collection]);
    setCurrentParentId(collection.id);
  };

  const navigateBack = () => {
    const next = breadcrumbs.slice(0, -1);
    setBreadcrumbs(next);
    setCurrentParentId(next.length > 0 ? next[next.length - 1].id : null);
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setBreadcrumbs([]);
      setCurrentParentId(null);
    } else {
      const next = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(next);
      setCurrentParentId(next[next.length - 1].id);
    }
  };

  const handleMove = () => {
    const targetId = selectedId === "root" ? null : selectedId;
    if (targetId === link.parent_id) {
      onClose();
      return;
    }
    updateLinkMutation.mutate({ id: link.id, data: { parent_id: targetId } });
  };

  const currentSelectionName =
    selectedId === "root"
      ? "Home"
      : allCollections.find((c) => c.id === selectedId)?.name ?? "Unknown";

  const isCurrentLocation =
    selectedId === "root"
      ? link.parent_id === null
      : selectedId === link.parent_id;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-[10000] w-full max-w-sm mx-4 bg-theme_primary_black border-2 border-white/20 rounded-md overflow-hidden flex flex-col h-[70vh] max-h-[520px] min-h-[320px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">Move to collection</h2>
            <p className="text-[0.65rem] text-white/40 truncate mt-0.5">
              {link.name || link.link}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors ml-3 shrink-0 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Search bar */}
        <div className="px-3 py-2.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5">
            <BiSearch className="text-white/30 shrink-0 text-sm" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              autoFocus
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setViewMode(e.target.value ? "search" : "browse");
              }}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setViewMode("browse");
                }}
                className="text-white/30 hover:text-white transition-colors text-sm leading-none"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb nav — browse mode only */}
        {viewMode === "browse" && (
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/8 shrink-0 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigateToBreadcrumb(-1)}
              className={cn(
                "flex items-center gap-1 text-[0.65rem] shrink-0 transition-colors",
                currentParentId === null
                  ? "text-white font-medium"
                  : "text-white/40 hover:text-white",
              )}
            >
              <BiHome className="text-[0.7rem]" />
              Home
            </button>
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.id} className="flex items-center gap-1 shrink-0">
                <BiChevronRight className="text-white/25 text-[0.65rem]" />
                <button
                  onClick={() => navigateToBreadcrumb(i)}
                  className={cn(
                    "text-[0.65rem] transition-colors max-w-[80px] truncate",
                    i === breadcrumbs.length - 1
                      ? "text-white font-medium"
                      : "text-white/40 hover:text-white",
                  )}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Collection list */}
        <div className="flex-1 overflow-y-auto py-1 min-h-0">
          {viewMode === "browse" ? (
            <>
              {/* "Move here" option for current browse level */}
              <CollectionOption
                id={currentParentId === null ? "root" : currentParentId}
                name={
                  currentParentId === null
                    ? "Home"
                    : breadcrumbs[breadcrumbs.length - 1]?.name ?? "Here"
                }
                isHome={currentParentId === null}
                isSelected={
                  currentParentId === null
                    ? selectedId === "root"
                    : selectedId === currentParentId
                }
                isCurrent={
                  currentParentId === null
                    ? link.parent_id === null
                    : link.parent_id === currentParentId
                }
                hasChildren={false}
                onClick={() =>
                  setSelectedId(currentParentId === null ? "root" : currentParentId)
                }
                isThisLevel
              />

              {visibleCollections.length === 0 ? (
                <p className="text-xs text-white/25 px-4 py-3">
                  No sub-collections here
                </p>
              ) : (
                visibleCollections.map((col) => {
                  const hasChildren = allCollections.some(
                    (c) => c.parent_id === col.id,
                  );
                  return (
                    <CollectionOption
                      key={col.id}
                      id={col.id}
                      name={col.name}
                      isHome={false}
                      isSelected={selectedId === col.id}
                      isCurrent={link.parent_id === col.id}
                      hasChildren={hasChildren}
                      onClick={() => setSelectedId(col.id)}
                      onNavigate={() => navigate(col)}
                    />
                  );
                })
              )}
            </>
          ) : searchResults.length === 0 ? (
            <p className="text-xs text-white/25 px-4 py-4 text-center">
              No collections found
            </p>
          ) : (
            searchResults.map((col) => {
              const hasChildren = allCollections.some(
                (c) => c.parent_id === col.id,
              );
              return (
                <CollectionOption
                  key={col.id}
                  id={col.id}
                  name={col.name}
                  isHome={false}
                  isSelected={selectedId === col.id}
                  isCurrent={link.parent_id === col.id}
                  hasChildren={hasChildren}
                  onClick={() => setSelectedId(col.id)}
                />
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-white/10 shrink-0 flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-1.5">
            <BiSolidFolder className="text-white/30 shrink-0 text-xs" />
            <span className="text-xs text-white/50 truncate">
              Moving to:{" "}
              <span className="text-white font-medium">{currentSelectionName}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMove}
              disabled={updateLinkMutation.isPending || isCurrentLocation}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
                isCurrentLocation
                  ? "bg-white/5 text-white/25 cursor-not-allowed"
                  : "bg-white text-black hover:bg-white/90 cursor-pointer",
              )}
            >
              {updateLinkMutation.isPending && (
                <RiLoaderLine className="animate-spin text-xs" />
              )}
              {isCurrentLocation ? "Already here" : "Move"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── CollectionOption ──────────────────────────────────────────────────────────

type CollectionOptionProps = {
  id: string;
  name: string;
  isHome: boolean;
  isSelected: boolean;
  isCurrent: boolean;
  hasChildren: boolean;
  isThisLevel?: boolean;
  onClick: () => void;
  onNavigate?: () => void;
};

function CollectionOption({
  id,
  name,
  isHome,
  isSelected,
  isCurrent,
  hasChildren,
  isThisLevel = false,
  onClick,
  onNavigate,
}: CollectionOptionProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors group/opt",
        isSelected ? "bg-white/10" : "hover:bg-white/5",
      )}
      onClick={onClick}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center transition-all",
          isSelected
            ? "border-white bg-white"
            : "border-white/20 group-hover/opt:border-white/40",
        )}
      >
        {isSelected && (
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
        )}
      </div>

      {/* Icon */}
      {isHome ? (
        <BiHome className="text-white/50 text-sm shrink-0" />
      ) : (
        <BiFolder className="text-white/50 text-sm shrink-0" />
      )}

      {/* Name */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span
          className={cn(
            "text-xs truncate",
            isSelected ? "text-white font-medium" : "text-white/70",
          )}
        >
          {name}
          {isThisLevel && !isHome && (
            <span className="ml-1.5 text-[0.6rem] text-white/30">(this level)</span>
          )}
        </span>
        {isCurrent && (
          <span className="text-[0.55rem] px-1 py-0.5 rounded border border-white/15 text-white/30 shrink-0">
            current
          </span>
        )}
      </div>

      {/* Navigate deeper */}
      {hasChildren && onNavigate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate();
          }}
          className="shrink-0 text-white/20 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10"
          title="Browse sub-collections"
        >
          <BiChevronRight className="text-sm" />
        </button>
      )}
    </div>
  );
}
