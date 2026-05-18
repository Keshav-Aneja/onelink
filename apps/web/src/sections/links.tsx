import { useAppDispatch, useAppSelector } from "@store/store";
import type { Link } from "@onelink/entities/models";
import { Fragment, useEffect, useMemo, useState } from "react";
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
}

function LinkGroup({ links, viewMode, gridClass, cardHeight }: LinkGroupProps) {
  if (viewMode === "grid") {
    return (
      <div className={`w-full grid ${gridClass}`}>
        {links.map((link, i) => (
          <LinkCard data={link} key={link.id} height={cardHeight} index={i} />
        ))}
      </div>
    );
  }
  if (viewMode === "list") {
    return (
      <div className="w-full flex flex-col border border-white/8 rounded-md overflow-hidden">
        {links.map((link) => (
          <LinkListItem data={link} key={link.id} />
        ))}
      </div>
    );
  }
  // compact
  return (
    <div className="w-full flex flex-col border border-white/8 rounded-md overflow-hidden">
      {links.map((link) => (
        <LinkCompactItem data={link} key={link.id} />
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

  const [shouldFetchLinks, setShouldFetchLinks] = useState<boolean>(
    !links || links.length === 0,
  );
  const linkQuery = useLinks(shouldFetchLinks, pathId);

  useEffect(() => {
    setShouldFetchLinks(!links || links.length === 0);
  }, [pathId]);

  useEffect(() => {
    if (linkQuery.isSuccess && linkQuery.data?.data) {
      setShouldFetchLinks(false);
      if (!links || links.length === 0) {
        dispatch(addMultipleLinks(linkQuery.data.data));
      }
    }
  }, [linkQuery.isSuccess, linkQuery.data]);

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

  const { gridClass, cardHeight } =
    DENSITY_CONFIG[prefs.gridDensity] ?? DENSITY_CONFIG[6];

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
        />
      </div>

      {processedLinks.length === 0 && (
        <p className="text-sm text-white/30 py-6 text-center">
          No links match the current filter.
        </p>
      )}

      {groupedLinks ? (
        // Domain-grouped rendering
        <div className="w-full flex flex-col gap-6">
          {groupedLinks.map(([domain, domainLinks]) => (
              <div key={domain} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                    alt=""
                    width={14}
                    height={14}
                    className="opacity-60"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <span className="text-xs font-medium text-white/50">
                    {domain}
                  </span>
                  <span className="text-[0.6rem] text-white/25">
                    {domainLinks.length}{" "}
                    {domainLinks.length === 1 ? "link" : "links"}
                  </span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>
                <LinkGroup
                  links={domainLinks}
                  viewMode={prefs.viewMode}
                  gridClass={gridClass}
                  cardHeight={cardHeight}
                />
              </div>
            ))}
        </div>
      ) : (
        // Flat rendering
        <LinkGroup
          links={processedLinks}
          viewMode={prefs.viewMode}
          gridClass={gridClass}
          cardHeight={cardHeight}
        />
      )}
    </Fragment>
  );
};

export default LinksContent;
