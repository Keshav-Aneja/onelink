import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTagToLink, confirmTag, removeTag } from "@features/tags/tags-api";
import { Link, Tag } from "@onelink/entities/models";
import { IoClose, IoCheckmark } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import { useAppDispatch } from "@store/store";
import { replaceLink } from "@store/slices/links-slice";
import { setSelectedLink } from "@store/slices/application-slice";

interface LinkTagsSectionProps {
  link: Link;
}

const LinkTagsSection = ({ link }: LinkTagsSectionProps) => {
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const dispatch = useAppDispatch();

  const tags: Tag[] = link.tags ?? [];
  const confirmed = tags.filter((t) => t.confirmed);
  const suggestions = tags.filter((t) => !t.confirmed);

  const updateLinkTags = (newTags: Tag[]) => {
    const updated = { ...link, tags: newTags };
    dispatch(replaceLink(updated));
    dispatch(setSelectedLink(updated));
  };

  const confirmMutation = useMutation({
    mutationFn: ({ tagId }: { tagId: string }) =>
      confirmTag(link.id, tagId),
    onSuccess: (_, { tagId }) => {
      updateLinkTags(tags.map((t) => (t.id === tagId ? { ...t, confirmed: true } : t)));
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ tagId }: { tagId: string }) =>
      removeTag(link.id, tagId),
    onSuccess: (_, { tagId }) => {
      updateLinkTags(tags.filter((t) => t.id !== tagId));
    },
  });

  const addMutation = useMutation({
    mutationFn: (name: string) => addTagToLink(link.id, name),
    onSuccess: (res) => {
      if (res?.data) {
        updateLinkTags([...tags, { ...res.data, confirmed: true }]);
      }
      setInput("");
      setAdding(false);
    },
  });

  const handleAdd = () => {
    const name = input.trim();
    if (name.length < 2) return;
    addMutation.mutate(name);
  };

  if (tags.length === 0 && !adding) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors"
        >
          <IoAdd /> Add tags
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {suggestions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Suggested tags
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 border border-dashed border-primary/40 text-primary/70 text-xs px-2 py-0.5 rounded-full"
              >
                {tag.name}
                <button
                  type="button"
                  title="Confirm tag"
                  onClick={() => confirmMutation.mutate({ tagId: tag.id })}
                  className="hover:text-green-400 cursor-pointer"
                >
                  <IoCheckmark />
                </button>
                <button
                  type="button"
                  title="Dismiss"
                  onClick={() => removeMutation.mutate({ tagId: tag.id })}
                  className="hover:text-red-400 cursor-pointer"
                >
                  <IoClose />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {confirmed.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {confirmed.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 bg-primary/15 border border-primary/35 text-primary text-xs px-2 py-0.5 rounded-full"
            >
              {tag.name}
              <button
                type="button"
                title="Remove tag"
                onClick={() => removeMutation.mutate({ tagId: tag.id })}
                className="hover:text-red-400 cursor-pointer"
              >
                <IoClose />
              </button>
            </span>
          ))}
        </div>
      )}

      {adding ? (
        <div className="flex items-center gap-2 mt-1">
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleAdd(); }
              if (e.key === "Escape") { setAdding(false); setInput(""); }
            }}
            placeholder="tag name…"
            className="flex-1 bg-transparent border-b border-white/20 text-xs text-white outline-none py-0.5 placeholder:text-white/30"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={addMutation.isPending}
            className="text-xs text-primary hover:text-primary/70 cursor-pointer disabled:opacity-40"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setAdding(false); setInput(""); }}
            className="text-xs text-white/30 hover:text-white/60 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="self-start flex items-center gap-1 text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors"
        >
          <IoAdd /> Add tag
        </button>
      )}
    </div>
  );
};

export default LinkTagsSection;
