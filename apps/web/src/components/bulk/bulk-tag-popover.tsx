import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import type { Link } from "@onelink/entities/models";
import { cn } from "@lib/tailwind-utils";
import { BiSearch } from "react-icons/bi";
import { RiLoaderLine } from "react-icons/ri";

type TagState = "all" | "some" | "none";

interface TagEntry {
  name: string;
  state: TagState;
}

interface BulkTagPopoverProps {
  selectedIds: string[];
  allLinks: Link[];
  onClose: () => void;
  onApplyTags: (toAdd: string[], toRemove: string[]) => void;
  isPending?: boolean;
}

export function BulkTagPopover({
  selectedIds,
  allLinks,
  onClose,
  onApplyTags,
  isPending,
}: BulkTagPopoverProps) {
  const selectedLinks = allLinks.filter((l) => selectedIds.includes(l.id));

  // Build map: tagName → how many selected links have it
  const tagCountMap = useMemo(() => {
    const map = new Map<string, number>();
    selectedLinks.forEach((link) => {
      link.tags?.forEach((t) => {
        if (t.confirmed) {
          map.set(t.name, (map.get(t.name) ?? 0) + 1);
        }
      });
    });
    return map;
  }, [selectedLinks]);

  // Also collect all available tags from the full link list for suggestions
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>();
    allLinks.forEach((l) => l.tags?.forEach((t) => { if (t.confirmed) set.add(t.name); }));
    return Array.from(set).sort();
  }, [allLinks]);

  const initialTags: TagEntry[] = useMemo(() => {
    return allAvailableTags.map((name) => {
      const count = tagCountMap.get(name) ?? 0;
      const state: TagState =
        count === selectedLinks.length ? "all" :
        count > 0 ? "some" : "none";
      return { name, state };
    });
  }, [allAvailableTags, tagCountMap, selectedLinks.length]);

  // Local override state: maps tag name → desired final state (null = no change from initial)
  const [overrides, setOverrides] = useState<Map<string, "all" | "none">>(new Map());
  const [search, setSearch] = useState("");
  const [newTag, setNewTag] = useState("");

  const resolvedTags: TagEntry[] = useMemo(() => {
    return initialTags.map((t) => {
      const override = overrides.get(t.name);
      return override ? { name: t.name, state: override } : t;
    });
  }, [initialTags, overrides]);

  const filteredTags = useMemo(() => {
    const q = search.toLowerCase();
    return resolvedTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [resolvedTags, search]);

  const toggle = (name: string, currentState: TagState) => {
    // none / some → all; all → none
    const next: "all" | "none" = currentState === "all" ? "none" : "all";
    setOverrides((prev) => new Map(prev).set(name, next));
  };

  const handleApply = () => {
    const toAdd: string[] = [];
    const toRemove: string[] = [];
    resolvedTags.forEach((t) => {
      const initial = initialTags.find((i) => i.name === t.name)!;
      if (t.state === "all" && initial.state !== "all") toAdd.push(t.name);
      if (t.state === "none" && initial.state !== "none") toRemove.push(t.name);
    });
    // New tag
    const trimmed = newTag.trim();
    if (trimmed && !toAdd.includes(trimmed)) toAdd.push(trimmed);
    onApplyTags(toAdd, toRemove);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-[10000] w-full max-w-xs mx-4 bg-[#111] border border-white/20 rounded-md overflow-hidden flex flex-col max-h-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <h2 className="text-sm font-semibold text-white">Tag {selectedIds.length} links</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-lg leading-none">✕</button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5">
            <BiSearch className="text-white/30 text-sm shrink-0" />
            <input
              type="text"
              placeholder="Search tags..."
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Tag list */}
        <div className="flex-1 overflow-y-auto py-1 min-h-0">
          {filteredTags.length === 0 ? (
            <p className="text-xs text-white/25 px-4 py-3 text-center">No tags found</p>
          ) : (
            filteredTags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => toggle(tag.name, tag.state)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 transition-colors cursor-pointer hover:bg-white/5",
                )}
              >
                {/* Checkbox with partial state */}
                <div className={cn(
                  "w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center transition-all",
                  tag.state === "all" ? "border-primary bg-primary" :
                  tag.state === "some" ? "border-primary/60 bg-primary/20" :
                  "border-white/20",
                )}>
                  {tag.state === "all" && <span className="text-white text-[0.55rem] font-bold leading-none">✓</span>}
                  {tag.state === "some" && <span className="text-primary text-[0.55rem] font-bold leading-none">—</span>}
                </div>
                <span className={cn(
                  "text-xs truncate",
                  tag.state === "all" ? "text-white font-medium" : "text-white/60",
                )}>
                  {tag.name}
                </span>
                {tag.state === "some" && (
                  <span className="ml-auto text-[0.6rem] text-white/25 shrink-0">partial</span>
                )}
              </button>
            ))
          )}
        </div>

        {/* New tag input */}
        <div className="px-3 py-2 border-t border-white/10 shrink-0">
          <input
            type="text"
            placeholder="Create new tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5 border-t border-white/10 shrink-0 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-white/50 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isPending}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-white text-black hover:bg-white/90 cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && <RiLoaderLine className="animate-spin text-xs" />}
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
