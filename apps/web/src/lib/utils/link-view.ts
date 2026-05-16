import type { Link } from "@onelink/entities/models";
import type { FilterBy, SortBy } from "@hooks/view-preferences";
import extractDomain from "./extract-domain";

export function filterLinks(links: Link[], filterBy: FilterBy): Link[] {
  switch (filterBy) {
    case "starred":
      return links.filter((l) => l.is_starred);
    case "has_rss":
      return links.filter((l) => !!l.rss && l.rss.length > 0);
    default:
      return links;
  }
}

export function filterLinksByTags(links: Link[], tagFilter: string[]): Link[] {
  if (tagFilter.length === 0) return links;
  return links.filter((l) =>
    tagFilter.every((t) => l.tags?.some((lt) => lt.name === t)),
  );
}

export function sortLinks(links: Link[], sortBy: SortBy): Link[] {
  const sorted = [...links];
  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    case "oldest":
      return sorted.sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
    case "name_asc":
      return sorted.sort((a, b) =>
        (a.name ?? a.link).localeCompare(b.name ?? b.link),
      );
    case "name_desc":
      return sorted.sort((a, b) =>
        (b.name ?? b.link).localeCompare(a.name ?? a.link),
      );
    default:
      return sorted;
  }
}

export function groupLinksByDomain(links: Link[]): Record<string, Link[]> {
  return links.reduce(
    (acc, link) => {
      const domain = extractDomain(link.link);
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(link);
      return acc;
    },
    {} as Record<string, Link[]>,
  );
}
