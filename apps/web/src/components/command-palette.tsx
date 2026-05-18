import { cn } from "@lib/tailwind-utils";
import { highlightMatch } from "@lib/utils/highlight-match";
import { useCommandPalette } from "@hooks/use-command-palette";
import { Collection, Link } from "@onelink/entities/models";
import { createPortal } from "react-dom";
import {
  IoSearchOutline,
  IoStar,
  IoFolderOutline,
  IoPricetagOutline,
} from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { RiArrowRightLine } from "react-icons/ri";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import type { ActiveFilter } from "@hooks/use-command-palette";

const CommandPalette = () => {
  const {
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
  } = useCommandPalette();

  const handleSelectLink = (link: Link) => {
    window.open(link.link, "_blank");
    close();
  };

  const filterLabel = () => {
    if (activeFilter.type === "all") return null;
    if (activeFilter.type === "starred") return "Starred";
    if (activeFilter.type === "collection") return `in: ${activeFilter.label}`;
    if (activeFilter.type === "tag") return `#${activeFilter.label}`;
    return null;
  };

  const label = filterLabel();

  return (
    <>
      {/* Trigger bar */}
      <div
        className="relative min-w-32 md:min-w-60 bg-theme_primary_black border border-white/20 h-10 xxl:h-12 rounded-lg grow font-kustom cursor-pointer flex items-center px-3 md:px-4 gap-2"
        onClick={open}
      >
        <IoSearchOutline className="text-white/60 text-sm md:text-lg xxl:text-xl shrink-0" />
        <div className="flex-1 text-white/40 text-sm md:text-base truncate">
          {label ? (
            <span className="text-white/60">{label}</span>
          ) : (
            "Search links..."
          )}
        </div>
        <kbd className="hidden md:block px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white/60 shrink-0">
          ⌘K
        </kbd>
      </div>

      {isOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={close}
            />

            {/* Palette */}
            <div className="fixed top-4 md:top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 font-kustom px-4">
              <div className="bg-theme_primary_black border border-white/20 rounded-xl shadow-2xl overflow-hidden">

                {/* Search input */}
                <div className="relative h-14 border-b border-white/10 flex items-center">
                  <IoSearchOutline className="absolute left-4 text-xl text-white/60 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={isNavigateMode ? "Navigate to..." : "Search links..."}
                    name="command_palette_search"
                    className="w-full h-full bg-transparent outline-none border-0 px-6 pl-12 pr-16 text-white placeholder:text-white/40 text-sm md:text-base"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <kbd className="absolute right-4 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white/60">
                    ESC
                  </kbd>
                </div>

                {/* Filter pills — only in search mode */}
                {!isNavigateMode && (
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 flex-wrap relative">
                    {(["all", "starred"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilter({ type })}
                        className={cn(
                          "flex items-center gap-1 px-3 py-1 rounded-full text-xs border transition-colors",
                          activeFilter.type === type
                            ? "bg-white/20 border-white/40 text-white"
                            : "bg-transparent border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
                        )}
                      >
                        {type === "starred" && <IoStar className="text-yellow-400 text-[10px]" />}
                        {type === "all" ? "All" : "Starred"}
                      </button>
                    ))}

                    {/* Collection filter */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowCollectionPicker(!showCollectionPicker);
                          setShowTagPicker(false);
                        }}
                        className={cn(
                          "flex items-center gap-1 px-3 py-1 rounded-full text-xs border transition-colors",
                          activeFilter.type === "collection"
                            ? "bg-white/20 border-white/40 text-white"
                            : "bg-transparent border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
                        )}
                      >
                        <IoFolderOutline className="text-[10px]" />
                        {activeFilter.type === "collection"
                          ? activeFilter.label
                          : "Collection"}
                        <span className="text-white/40">▾</span>
                      </button>

                      {showCollectionPicker && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-xl z-10 overflow-hidden">
                          <div className="p-2 border-b border-white/10">
                            <input
                              type="text"
                              placeholder="Find collection..."
                              className="w-full bg-white/5 rounded px-2 py-1 text-xs text-white placeholder:text-white/40 outline-none"
                              value={collectionSearch}
                              onChange={(e) => setCollectionSearch(e.target.value)}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {activeFilter.type === "collection" && (
                              <button
                                className="w-full text-left px-3 py-2 text-xs text-white/50 hover:bg-white/5 italic"
                                onClick={() => setFilter({ type: "all" })}
                              >
                                Clear filter
                              </button>
                            )}
                            {filteredCollections.map((col: Collection) => (
                              <button
                                key={col.id}
                                className={cn(
                                  "w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2",
                                  activeFilter.value === col.id
                                    ? "bg-white/15 text-white"
                                    : "text-white/70 hover:bg-white/5"
                                )}
                                onClick={() =>
                                  setFilter({
                                    type: "collection",
                                    value: col.id,
                                    label: col.name,
                                  })
                                }
                              >
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ background: col.color }}
                                />
                                {col.name}
                              </button>
                            ))}
                            {filteredCollections.length === 0 && (
                              <p className="px-3 py-4 text-xs text-white/30 text-center">No collections found</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tag filter */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowTagPicker(!showTagPicker);
                          setShowCollectionPicker(false);
                        }}
                        className={cn(
                          "flex items-center gap-1 px-3 py-1 rounded-full text-xs border transition-colors",
                          activeFilter.type === "tag"
                            ? "bg-white/20 border-white/40 text-white"
                            : "bg-transparent border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
                        )}
                      >
                        <IoPricetagOutline className="text-[10px]" />
                        {activeFilter.type === "tag" ? `#${activeFilter.label}` : "Tag"}
                        <span className="text-white/40">▾</span>
                      </button>

                      {showTagPicker && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-xl z-10 overflow-hidden">
                          <div className="p-2 border-b border-white/10">
                            <input
                              type="text"
                              placeholder="Find tag..."
                              className="w-full bg-white/5 rounded px-2 py-1 text-xs text-white placeholder:text-white/40 outline-none"
                              value={tagSearch}
                              onChange={(e) => setTagSearch(e.target.value)}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {activeFilter.type === "tag" && (
                              <button
                                className="w-full text-left px-3 py-2 text-xs text-white/50 hover:bg-white/5 italic"
                                onClick={() => setFilter({ type: "all" })}
                              >
                                Clear filter
                              </button>
                            )}
                            {filteredTags.map((tag) => (
                              <button
                                key={tag.id}
                                className={cn(
                                  "w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between",
                                  activeFilter.value === tag.name
                                    ? "bg-white/15 text-white"
                                    : "text-white/70 hover:bg-white/5"
                                )}
                                onClick={() =>
                                  setFilter({
                                    type: "tag",
                                    value: tag.name,
                                    label: tag.name,
                                  })
                                }
                              >
                                <span>#{tag.name}</span>
                                <span className="text-white/30">{tag.link_count}</span>
                              </button>
                            ))}
                            {filteredTags.length === 0 && (
                              <p className="px-3 py-4 text-xs text-white/30 text-center">No tags found</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigate mode hint */}
                    <span className="ml-auto text-xs text-white/25 hidden md:block">
                      Type <kbd className="px-1 bg-white/10 rounded text-white/40">&gt;</kbd> to navigate
                    </span>
                  </div>
                )}

                {/* Results area */}
                <div className="max-h-[50vh] md:max-h-[420px] overflow-y-auto">

                  {/* Navigate mode results */}
                  {isNavigateMode && (
                    <>
                      {navCommands.length > 0 ? (
                        <>
                          <div className="px-4 pt-3 pb-1">
                            <span className="text-xs text-white/30 uppercase tracking-wider">Navigate</span>
                          </div>
                          {navCommands.map((cmd, idx) => (
                            <div
                              key={cmd.id}
                              className={cn(
                                "px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 border-b border-white/5 last:border-b-0",
                                idx === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                              )}
                              onClick={() => { cmd.action(); close(); }}
                              onMouseEnter={() => setSelectedIndex(idx)}
                            >
                              <RiArrowRightLine className="text-white/40 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-white text-sm">{cmd.label}</span>
                                {cmd.description && (
                                  <span className="text-white/40 text-xs ml-2">{cmd.description}</span>
                                )}
                              </div>
                              {idx === selectedIndex && (
                                <MdOutlineKeyboardReturn className="text-white/40 shrink-0" />
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="px-4 py-8 text-center text-white/40 text-sm">
                          No results for "{query.slice(1).trim()}"
                        </div>
                      )}
                    </>
                  )}

                  {/* Search mode results */}
                  {!isNavigateMode && (
                    <>
                      {isLoading && (
                        <div className="px-4 py-8 flex justify-center text-white/40">
                          <ImSpinner2 className="animate-spin" />
                        </div>
                      )}

                      {!isLoading && results.length > 0 && (
                        <>
                          <div className="px-4 pt-3 pb-1">
                            <span className="text-xs text-white/30 uppercase tracking-wider">
                              Links {results.length > 0 && `· ${results.length}`}
                            </span>
                          </div>
                          {results.map((link, idx) => {
                            const collectionName = getCollectionName(link.parent_id);
                            return (
                              <div
                                key={link.id}
                                className={cn(
                                  "px-4 py-3 cursor-pointer transition-colors border-b border-white/5 last:border-b-0",
                                  idx === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                                )}
                                onClick={() => handleSelectLink(link)}
                                onMouseEnter={() => setSelectedIndex(idx)}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      {link.is_starred && (
                                        <IoStar className="text-yellow-400 text-xs shrink-0" />
                                      )}
                                      <h3 className="text-white font-medium truncate text-sm">
                                        {highlightMatch(link.name || link.link, query)}
                                      </h3>
                                    </div>
                                    {link.description && (
                                      <p className="text-white/50 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                                        {highlightMatch(link.description, query)}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-white/30 text-xs truncate flex-1">
                                        {link.link}
                                      </p>
                                      {collectionName && (
                                        <span className="text-white/40 text-xs bg-white/5 border border-white/10 rounded px-2 py-0.5 shrink-0 flex items-center gap-1">
                                          <IoFolderOutline className="text-[10px]" />
                                          {collectionName}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {idx === selectedIndex && (
                                    <MdOutlineKeyboardReturn className="text-white/40 shrink-0 mt-0.5" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}

                      {!isLoading && query.trim().length > 0 && results.length === 0 && (
                        <div className="px-4 py-8 text-center text-white/40 text-sm">
                          No links found for "{query}"
                        </div>
                      )}

                      {!query && (
                        <div className="px-4 py-6 text-center text-white/25 text-sm">
                          Type to search your links
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-white/25 text-xs">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd> close
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">⌘K</kbd>
                  </span>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
};

export default CommandPalette;
