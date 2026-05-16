import { useState, useEffect, useCallback } from "react";

export type ViewMode = "grid" | "list" | "compact";
export type SortBy = "newest" | "oldest" | "name_asc" | "name_desc";
export type FilterBy = "all" | "starred" | "has_rss";

export interface ViewPreferences {
  viewMode: ViewMode;
  sortBy: SortBy;
  filterBy: FilterBy;
  groupByDomain: boolean;
  gridDensity: number;
}

const DEFAULT_PREFS: ViewPreferences = {
  viewMode: "grid",
  sortBy: "newest",
  filterBy: "all",
  groupByDomain: false,
  gridDensity: 6,
};

const getStorageKey = (collectionId: string | null) =>
  `onelink_view_${collectionId ?? "root"}`;

export function useViewPreferences(collectionId: string | null) {
  const [prefs, setPrefs] = useState<ViewPreferences>(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(collectionId));
      if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_PREFS;
  });

  // Re-read from localStorage when the collection changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(collectionId));
      setPrefs(stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS);
    } catch {
      setPrefs(DEFAULT_PREFS);
    }
  }, [collectionId]);

  const updatePrefs = useCallback(
    (updates: Partial<ViewPreferences>) => {
      setPrefs((prev) => {
        const next = { ...prev, ...updates };
        try {
          localStorage.setItem(getStorageKey(collectionId), JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [collectionId],
  );

  return { prefs, updatePrefs };
}
