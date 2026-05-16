import { cn } from "@lib/tailwind-utils";
import type {
  FilterBy,
  SortBy,
  ViewMode,
  ViewPreferences,
} from "@hooks/view-preferences";
import {
  PiGridFour,
  PiListBullets,
  PiRows,
  PiArrowsDownUp,
  PiFunnel,
  PiGlobe,
} from "react-icons/pi";
import { HiOutlineTag } from "react-icons/hi";

interface ViewToolbarProps {
  prefs: ViewPreferences;
  onUpdate: (updates: Partial<ViewPreferences>) => void;
  linkCount: number;
  availableTags?: string[];
}

const VIEW_MODES: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
  { mode: "grid", icon: <PiGridFour />, label: "Grid" },
  { mode: "list", icon: <PiListBullets />, label: "List" },
  { mode: "compact", icon: <PiRows />, label: "Compact" },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Name A → Z" },
  { value: "name_desc", label: "Name Z → A" },
];

const FILTER_OPTIONS: { value: FilterBy; label: string }[] = [
  { value: "all", label: "All" },
  { value: "starred", label: "Starred" },
  { value: "has_rss", label: "Has RSS" },
];

const DENSITY_COLS: Record<number, string> = {
  3: "3",
  4: "4",
  5: "5",
  6: "6",
};

export default function ViewToolbar({
  prefs,
  onUpdate,
  linkCount,
  availableTags = [],
}: ViewToolbarProps) {
  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === prefs.sortBy)?.label ?? "Sort";
  const activeFilterLabel =
    FILTER_OPTIONS.find((o) => o.value === prefs.filterBy)?.label ?? "Filter";
  const tagFilter = prefs.tagFilter ?? [];

  const toggleTag = (tag: string) => {
    const next = tagFilter.includes(tag)
      ? tagFilter.filter((t) => t !== tag)
      : [...tagFilter, tag];
    onUpdate({ tagFilter: next });
  };

  return (
    <div className="w-full flex flex-col gap-2 py-2">
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        {/* Left: view mode toggle */}
        <div className="flex items-center gap-1 bg-white/5 rounded-md p-1 border border-white/10">
          {VIEW_MODES.map(({ mode, icon, label }) => (
            <button
              key={mode}
              title={label}
              onClick={() => onUpdate({ viewMode: mode })}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer",
                prefs.viewMode === mode
                  ? "bg-primary text-white"
                  : "text-white/50 hover:text-white hover:bg-white/10",
              )}
            >
              <span className="text-sm">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Right: controls cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30 transition-all duration-150 cursor-pointer">
              <PiArrowsDownUp className="text-sm" />
              <span className="hidden sm:inline">{activeSortLabel}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 z-50 w-36 bg-[#111] border border-white/10 rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all duration-150">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ sortBy: opt.value })}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer",
                    prefs.sortBy === opt.value
                      ? "text-white bg-primary/20"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter dropdown */}
          <div className="relative group">
            <button
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 cursor-pointer",
                prefs.filterBy !== "all"
                  ? "border-primary/60 bg-primary/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30",
              )}
            >
              <PiFunnel className="text-sm" />
              <span className="hidden sm:inline">{activeFilterLabel}</span>
              {prefs.filterBy !== "all" && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
            <div className="absolute right-0 top-full mt-1 z-50 w-32 bg-[#111] border border-white/10 rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all duration-150">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ filterBy: opt.value })}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer",
                    prefs.filterBy === opt.value
                      ? "text-white bg-primary/20"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group by domain toggle */}
          <button
            title="Group by domain"
            onClick={() => onUpdate({ groupByDomain: !prefs.groupByDomain })}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 cursor-pointer",
              prefs.groupByDomain
                ? "border-primary/60 bg-primary/10 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30",
            )}
          >
            <PiGlobe className="text-sm" />
            <span className="hidden sm:inline">Group</span>
            {prefs.groupByDomain && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>

          {/* Tag filter dropdown — only shown when the page has tagged links */}
          {availableTags.length > 0 && (
            <div className="relative group">
              <button
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 cursor-pointer",
                  tagFilter.length > 0
                    ? "border-primary/60 bg-primary/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30",
                )}
              >
                <HiOutlineTag className="text-sm" />
                <span className="hidden sm:inline">
                  {tagFilter.length > 0 ? `${tagFilter.length} tag${tagFilter.length > 1 ? "s" : ""}` : "Tags"}
                </span>
                {tagFilter.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
              <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-[#111] border border-white/10 rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all duration-150">
                {tagFilter.length > 0 && (
                  <>
                    <button
                      onClick={() => onUpdate({ tagFilter: [] })}
                      className="w-full text-left px-3 py-2 text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                    <div className="h-px bg-white/8 mx-2" />
                  </>
                )}
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between gap-2",
                      tagFilter.includes(tag)
                        ? "text-white bg-primary/20"
                        : "text-white/60 hover:text-white hover:bg-white/5",
                    )}
                  >
                    <span className="truncate">{tag}</span>
                    {tagFilter.includes(tag) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Density slider — only visible in grid mode */}
          {prefs.viewMode === "grid" && (
            <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-md px-2.5 py-1">
              <span className="text-[0.6rem] text-white/40 hidden sm:inline">
                Cols
              </span>
              <input
                type="range"
                min={3}
                max={6}
                step={1}
                value={prefs.gridDensity}
                onChange={(e) =>
                  onUpdate({ gridDensity: Number(e.target.value) })
                }
                className="w-16 h-1 accent-primary cursor-pointer"
              />
              <span className="text-[0.6rem] text-white/50 w-3 text-center">
                {DENSITY_COLS[prefs.gridDensity]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active state hint row */}
      {(prefs.filterBy !== "all" || prefs.groupByDomain || prefs.sortBy !== "newest" || tagFilter.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          {prefs.filterBy !== "all" && (
            <span className="text-[0.6rem] bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 rounded-full">
              {activeFilterLabel}
            </span>
          )}
          {prefs.sortBy !== "newest" && (
            <span className="text-[0.6rem] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">
              {activeSortLabel}
            </span>
          )}
          {prefs.groupByDomain && (
            <span className="text-[0.6rem] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">
              Grouped by domain
            </span>
          )}
          {tagFilter.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className="text-[0.6rem] bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors"
            >
              {t} ×
            </button>
          ))}
          <span className="text-[0.6rem] text-white/30 ml-auto">
            {linkCount} {linkCount === 1 ? "link" : "links"}
          </span>
        </div>
      )}
    </div>
  );
}
