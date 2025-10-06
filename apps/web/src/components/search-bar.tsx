import action from "@config/action";
import { debounce } from "@lib/utils/debounce";
import { Link } from "@onelink/entities/models";
import { useCallback, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [results, setResults] = useState<Link[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const searchLinks = async (query: string) => {
    try {
      setLoading(true);
      const links = await action.get<Link[]>(`/links/search?q=${query}`);
      setResults(links.data || []);
      setSelectedIndex(0);
    } catch (error) {
      console.log(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(searchLinks, 300), []);

  useEffect(() => {
    if (searchVal && searchVal.length > 0) {
      debouncedSearch(searchVal);
    } else {
      setResults([]);
    }
  }, [searchVal, debouncedSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchVal("");
        setResults([]);
      }

      if (isOpen && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + results.length) % results.length,
          );
        }
        if (e.key === "Enter") {
          e.preventDefault();
          handleSelectLink(results[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelectLink = (link: Link) => {
    window.open(link.link, "_blank");
    setIsOpen(false);
    setSearchVal("");
    setResults([]);
  };

  const handleInlineSearchClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="relative min-w-60 bg-theme_secondary_black/20 border-1 border-white/20 h-10 xxl:h-12 rounded-lg grow font-kustom cursor-pointer"
        onClick={handleInlineSearchClick}
      >
        <IoSearchOutline className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 text-sm md:text-lg xxl:text-xl text-white/60" />
        <div className="w-full h-full flex items-center px-6 pl-8 md:pl-12 text-white/40 text-sm md:text-base">
          Search for your links...
        </div>
        <kbd className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white/60">
          ⌘K
        </kbd>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => {
              setIsOpen(false);
              setSearchVal("");
              setResults([]);
            }}
          />

          <div className="fixed top-4 md:top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 font-kustom px-4">
            <div className="bg-theme_secondary_black/95 border border-white/20 rounded-lg shadow-2xl overflow-hidden">
              <div className="relative h-14 border-b border-white/10">
                <IoSearchOutline className="absolute top-1/2 left-4 -translate-y-1/2 text-xl text-white/60" />
                <input
                  type="text"
                  placeholder="Search for your links..."
                  name="link_search"
                  className="w-full h-full bg-transparent outline-none border-0 px-6 pl-12 text-white placeholder:text-white/40"
                  autoFocus
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
                <kbd className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 px-2 py-1 text-xs bg-primary border border-white/20 rounded text-white font-bold">
                  ESC
                </kbd>
              </div>

              {results.length > 0 && (
                <div className="max-h-[50vh] md:max-h-96 overflow-y-auto">
                  {results.map((link, idx) => (
                    <div
                      key={link.id}
                      className={`px-4 py-3 cursor-pointer transition-colors border-b border-white/5 last:border-b-0 ${
                        idx === selectedIndex
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => handleSelectLink(link)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {link.is_starred && (
                              <span className="text-yellow-400 text-sm">★</span>
                            )}
                            <h3 className="text-white font-medium truncate">
                              {link.name || link.link}
                            </h3>
                          </div>
                          {link.description && (
                            <p className="text-white/60 text-sm mt-1 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                          <p className="text-white/40 text-xs mt-1 truncate">
                            {link.link}
                          </p>
                        </div>
                        {idx === selectedIndex && (
                          <kbd className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white/60 shrink-0">
                            ↵
                          </kbd>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="px-4 py-8 text-white/40 flex justify-center">
                  <ImSpinner2 className="animate-spin" />
                </div>
              )}

              {!isLoading &&
                searchVal &&
                searchVal.length > 0 &&
                results.length === 0 && (
                  <div className="px-4 py-8 text-center text-white/40">
                    No links found
                  </div>
                )}

              {!searchVal && (
                <div className="px-4 py-3 text-center text-white/30 text-sm border-t border-white/5">
                  Type to search your links
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchBar;
