import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "@features/tags/tags-api";
import { Tag } from "@onelink/entities/models";
import { IoClose } from "react-icons/io5";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const TagInput = ({ value, onChange }: TagInputProps) => {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: existingTagsRes } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
    staleTime: 60_000,
  });

  const existingTags: Array<Tag & { link_count: number }> =
    existingTagsRes?.data ?? [];

  const suggestions = input.trim().length > 0
    ? existingTags.filter(
        (t) =>
          t.name.includes(input.trim().toLowerCase()) &&
          !value.includes(t.name),
      )
    : existingTags.filter((t) => !value.includes(t.name)).slice(0, 6);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addTag = (name: string) => {
    const normalized = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 40);
    if (normalized.length < 2 || value.includes(normalized)) return;
    onChange([...value, normalized]);
    setInput("");
    setOpen(false);
  };

  const removeTag = (name: string) => {
    onChange(value.filter((t) => t !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1" ref={wrapperRef}>
      <label className="first-letter:uppercase text-theme_secondary_white font-medium text-sm md:text-base">
        tags
        <span className="text-white/30 font-normal text-xs ml-2">(optional — press Enter or comma to add)</span>
      </label>

      <div className="min-h-10 border border-theme_secondary_white/60 rounded-md px-2 py-1.5 flex flex-wrap gap-1.5 cursor-text" onClick={() => { setOpen(true); }}>
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-primary/20 border border-primary/40 text-primary text-xs px-2 py-0.5 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="hover:text-white cursor-pointer"
            >
              <IoClose />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={value.length === 0 ? "Add tags or leave blank to auto-detect…" : ""}
          className="flex-1 min-w-[140px] bg-transparent text-sm outline-none text-white placeholder:text-white/30"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="relative z-50">
          <ul className="absolute top-0 left-0 w-full bg-[#1a1d27] border border-white/15 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((tag) => (
              <li key={tag.id}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); addTag(tag.name); }}
                  className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center justify-between"
                >
                  <span>{tag.name}</span>
                  <span className="text-xs text-white/30">{tag.link_count} links</span>
                </button>
              </li>
            ))}
            {input.trim().length > 1 &&
              !existingTags.some((t) => t.name === input.trim().toLowerCase()) && (
                <li>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); addTag(input); }}
                    className="w-full text-left px-3 py-2 text-sm text-primary/80 hover:bg-white/5 flex items-center gap-2"
                  >
                    <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded">new</span>
                    <span>&ldquo;{input.trim().toLowerCase()}&rdquo;</span>
                  </button>
                </li>
              )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TagInput;
