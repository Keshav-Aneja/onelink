import action from "@config/action";
import { paths } from "@config/paths";
import { getAllTags } from "@features/tags/tags-api";
import { debounce } from "@lib/utils/debounce";
import { Collection, Link, Tag } from "@onelink/entities/models";
import { getAllCollections } from "@store/slices/collections-slice";
import { useAppSelector } from "@store/store";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type FilterType = "all" | "starred" | "collection" | "tag";

export interface ActiveFilter {
  type: FilterType;
  value?: string;
  label?: string;
}

export interface NavCommand {
  id: string;
  label: string;
  description?: string;
  action: () => void;
}

const STATIC_NAV = [
  { id: "nav-collections", label: "Collections", href: paths.collections.root.path },
  { id: "nav-feeds", label: "Feeds", href: paths.feeds.path },
  { id: "nav-favourites", label: "Favourites", href: paths.favourite.path },
  { id: "nav-tags", label: "Tags", href: paths.tags.path },
  { id: "nav-settings", label: "Settings", href: paths.settings.path },
];

export function useCommandPalette() {
  const navigate = useNavigate();
  const collections = useAppSelector(getAllCollections);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>({ type: "all" });
  const [results, setResults] = useState<Link[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Array<Tag & { link_count: number }>>([]);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [collectionSearch, setCollectionSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const isNavigateMode = query.startsWith(">");
  const navigateQuery = isNavigateMode ? query.slice(1).trim().toLowerCase() : "";

  const buildNavCommands = useCallback(
    (navQ: string): NavCommand[] => {
      const staticCmds = STATIC_NAV.filter(
        (c) => !navQ || c.label.toLowerCase().includes(navQ)
      ).map((c) => ({
        id: c.id,
        label: c.label,
        action: () => { navigate(c.href); },
      }));

      const collectionCmds = collections
        .filter((col: Collection) => !navQ || col.name.toLowerCase().includes(navQ))
        .map((col: Collection) => ({
          id: `col-${col.id}`,
          label: col.name,
          description: "Collection",
          action: () => {
            navigate(paths.collections.collection.getHref(col.id));
          },
        }));

      return [...staticCmds, ...collectionCmds];
    },
    [collections, navigate]
  );

  const navCommands = isNavigateMode ? buildNavCommands(navigateQuery) : [];
  const totalItems = isNavigateMode ? navCommands.length : results.length;

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
    setActiveFilter({ type: "all" });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
    setShowCollectionPicker(false);
    setShowTagPicker(false);
    setCollectionSearch("");
    setTagSearch("");
  }, []);

  const searchLinks = useCallback(
    async (q: string, filter: ActiveFilter) => {
      if (!q.trim()) { setResults([]); return; }
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ q });
        if (filter.type === "starred") params.set("starred", "true");
        if (filter.type === "collection" && filter.value) params.set("collection_id", filter.value);
        if (filter.type === "tag" && filter.value) params.set("tag", filter.value);
        const res = await action.get<Link[]>(`/links/search?${params.toString()}`);
        setResults(res.data || []);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(searchLinks, 300), [searchLinks]);

  useEffect(() => {
    if (!isNavigateMode && query.trim().length > 0) {
      debouncedSearch(query, activeFilter);
    } else if (!isNavigateMode) {
      setResults([]);
    }
  }, [query, activeFilter, isNavigateMode, debouncedSearch]);

  useEffect(() => {
    if (isOpen && tags.length === 0) {
      getAllTags().then((res) => setTags(res.data || []));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? close() : open();
        return;
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        if (showCollectionPicker || showTagPicker) {
          setShowCollectionPicker(false);
          setShowTagPicker(false);
        } else {
          close();
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (totalItems > 0) setSelectedIndex((prev) => (prev + 1) % totalItems);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (totalItems > 0) setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (isNavigateMode) {
          navCommands[selectedIndex]?.action();
          close();
        } else if (results[selectedIndex]) {
          window.open(results[selectedIndex].link, "_blank");
          close();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isNavigateMode, navCommands, results, selectedIndex, totalItems, showCollectionPicker, showTagPicker, close, open]);

  const setFilter = useCallback((filter: ActiveFilter) => {
    setActiveFilter(filter);
    setSelectedIndex(0);
    setShowCollectionPicker(false);
    setShowTagPicker(false);
  }, []);

  const filteredCollections = collections.filter((c: Collection) =>
    !collectionSearch || c.name.toLowerCase().includes(collectionSearch.toLowerCase())
  );

  const filteredTags = tags.filter((t) =>
    !tagSearch || t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const getCollectionName = useCallback(
    (parentId: string | null | undefined): string | undefined => {
      if (!parentId) return undefined;
      return collections.find((c: Collection) => c.id === parentId)?.name;
    },
    [collections]
  );

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    activeFilter,
    setFilter,
    results,
    selectedIndex,
    setSelectedIndex,
    isLoading,
    isNavigateMode,
    navCommands,
    collections,
    tags,
    showCollectionPicker,
    setShowCollectionPicker,
    showTagPicker,
    setShowTagPicker,
    collectionSearch,
    setCollectionSearch,
    tagSearch,
    setTagSearch,
    filteredCollections,
    filteredTags,
    getCollectionName,
  };
}
