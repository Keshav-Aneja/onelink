import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTags, getLinksByTag } from "@features/tags/tags-api";
import LinkCard from "@components/cards/link-card";
import LinkCardSuspense from "@components/cards/link-card-suspense";
import { Tag } from "@onelink/entities/models";
import { HiOutlineTag } from "react-icons/hi";

const TagsContent = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: tagsRes, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
    staleTime: 60_000,
  });

  const { data: linksRes, isLoading: linksLoading } = useQuery({
    queryKey: ["links-by-tag", selectedTag],
    queryFn: () => getLinksByTag(selectedTag!),
    enabled: !!selectedTag,
    staleTime: 30_000,
  });

  const allTags: Array<Tag & { link_count: number }> = tagsRes?.data ?? [];
  const filtered = search.trim()
    ? allTags.filter((t) => t.name.includes(search.trim().toLowerCase()))
    : allTags;

  const links = linksRes?.data ?? [];

  return (
    <div className="flex flex-col lg:flex-row gap-5 min-h-0">
      {/* ── Tag list ── */}
      <aside className="w-full lg:w-60 xl:w-64 flex-shrink-0">
        <div className="bg-theme_secondary_black/30 rounded-xl p-2 flex flex-col gap-0.5">
          {/* Search */}
          <div className="px-1 pb-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags…"
              className="w-full bg-transparent border border-white/10 rounded-md px-3 py-1.5 text-xs text-white placeholder:text-secondary_text outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="h-px bg-white/5 mx-2 my-1" />

          {tagsLoading && (
            <div className="flex flex-col gap-1.5 p-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-9 rounded-lg bg-theme_secondary_black/60 animate-pulse" />
              ))}
            </div>
          )}

          {!tagsLoading && filtered.length === 0 && (
            <p className="text-xs text-secondary_text text-center py-4">No tags yet.</p>
          )}

          {filtered.map((tag) => (
            <div
              key={tag.id}
              onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                selectedTag === tag.name
                  ? "bg-theme_secondary_black"
                  : "hover:bg-theme_secondary_black/60"
              }`}
            >
              {selectedTag === tag.name && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
              )}
              <span className="text-sm flex-1 truncate">{tag.name}</span>
              <span className="text-xs text-secondary_text flex-shrink-0">{tag.link_count}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Links panel ── */}
      <main className="flex-1 min-w-0 flex flex-col">
        {!selectedTag && (
          <div className="flex-1 flex items-center justify-center mt-16">
            <div className="text-center flex flex-col items-center gap-3">
              <HiOutlineTag className="text-4xl text-secondary_text" />
              <p className="text-sm text-secondary_text">Select a tag to browse its links</p>
            </div>
          </div>
        )}

        {selectedTag && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-3 gap-4">
              <h2 className="text-sm font-medium text-secondary_text truncate">
                {selectedTag}
                {!linksLoading && (
                  <span className="ml-2 text-secondary_text/50">
                    ({links.length})
                  </span>
                )}
              </h2>
            </div>

            {linksLoading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <LinkCardSuspense key={i} />
                ))}
              </div>
            )}

            {!linksLoading && links.length === 0 && (
              <p className="text-sm text-secondary_text mt-6 text-center">
                No links with this tag.
              </p>
            )}

            {!linksLoading && links.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {links.map((link, i) => (
                  <LinkCard data={link} key={link.id} index={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TagsContent;
