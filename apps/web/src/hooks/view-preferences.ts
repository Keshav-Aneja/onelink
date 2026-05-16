import { useCallback } from "react";
import { useSettings } from "@features/settings/get-settings";
import { useUpdateSettings } from "@features/settings/update-settings";
import { useLocalStorage } from "./use-local-storage";

export type ViewMode = "grid" | "list" | "compact";
export type SortBy = "newest" | "oldest" | "name_asc" | "name_desc";
export type FilterBy = "all" | "starred" | "has_rss";

export interface ViewPreferences {
  viewMode: ViewMode;
  sortBy: SortBy;
  filterBy: FilterBy;
  groupByDomain: boolean;
  gridDensity: number;
  tagFilter: string[];
}

interface LocalPrefs {
  sortBy: SortBy;
  filterBy: FilterBy;
  groupByDomain: boolean;
  tagFilter: string[];
}

const DEFAULT_LOCAL: LocalPrefs = {
  sortBy: "newest",
  filterBy: "all",
  groupByDomain: false,
  tagFilter: [],
};

const getStorageKey = (collectionId: string | null) =>
  `onelink_view_${collectionId ?? "root"}`;

export function useViewPreferences(collectionId: string | null) {
  const { data: settingsData } = useSettings();
  const updateSettings = useUpdateSettings();

  const viewMode: ViewMode = (settingsData?.data?.view_mode as ViewMode) ?? "grid";
  const gridDensity: number = settingsData?.data?.grid_density ?? 6;

  const [localPrefs, setLocalPrefs] = useLocalStorage<LocalPrefs>(
    getStorageKey(collectionId),
    DEFAULT_LOCAL,
  );

  const prefs: ViewPreferences = {
    viewMode,
    gridDensity,
    sortBy: localPrefs.sortBy,
    filterBy: localPrefs.filterBy,
    groupByDomain: localPrefs.groupByDomain,
    tagFilter: localPrefs.tagFilter,
  };

  const updatePrefs = useCallback(
    (updates: Partial<ViewPreferences>) => {
      const { viewMode: newMode, gridDensity: newDensity, ...localUpdates } = updates;

      if (newMode !== undefined || newDensity !== undefined) {
        updateSettings.mutate({
          ...(newMode !== undefined && { view_mode: newMode }),
          ...(newDensity !== undefined && { grid_density: newDensity }),
        });
      }

      if (Object.keys(localUpdates).length > 0) {
        setLocalPrefs((prev) => ({ ...prev, ...localUpdates }));
      }
    },
    [updateSettings, setLocalPrefs],
  );

  return { prefs, updatePrefs };
}
