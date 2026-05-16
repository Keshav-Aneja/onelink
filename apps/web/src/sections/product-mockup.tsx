import { IoChevronForward } from "react-icons/io5";
import {
  FaGlobe,
  FaStar,
  FaBookmark,
  FaLock,
  FaPlus,
  FaMagnifyingGlass,
} from "react-icons/fa6";

const libraryItems = [
  { label: "All Links", count: 1248, Icon: FaGlobe },
  { label: "Starred", count: 86, Icon: FaStar },
  { label: "Unread", count: 14, Icon: FaBookmark },
];

const collections = [
  { name: "Design Systems", count: 42, color: "#dd4e52", open: true },
  { name: "Rust & Systems", count: 88, color: "#7c9eff", open: false },
  { name: "AI Papers", count: 134, color: "#5fd0a5", open: false },
  {
    name: "Side Quests",
    count: 27,
    color: "#f0a557",
    open: false,
    locked: true,
  },
  { name: "Reading List", count: 312, color: "#cfcfcf", open: false },
];

const mockLinks = [
  {
    site: "Vercel",
    title: "Designing for the web is changing fast — here's what we learned",
    tag: "Design",
    hue: 0,
  },
  {
    site: "Linear",
    title: "How we built our keyboard-first navigation model",
    tag: "UX",
    hue: 220,
  },
  {
    site: "Stripe",
    title: "The mechanics of a great pricing page",
    tag: "Marketing",
    hue: 30,
  },
  {
    site: "GitHub Blog",
    title: "Inside the editor: how Copilot ranks suggestions",
    tag: "Engineering",
    hue: 120,
  },
  {
    site: "Figma",
    title: "Auto-layout, finally, makes sense — a deep dive",
    tag: "Design",
    hue: 280,
  },
  {
    site: "arxiv.org",
    title: "Sparse attention and the limits of long-context retrieval",
    tag: "Research",
    hue: 340,
  },
];

function MockSidebar() {
  return (
    <aside className="hidden md:flex w-55 shrink-0 flex-col gap-1 border-r border-white/10 p-3 bg-[#0d0d0d]">
      <div className="px-2 py-2 text-[11px] uppercase tracking-widest text-secondary_text">
        Library
      </div>
      {libraryItems.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] text-theme_secondary_white hover:bg-white/5"
        >
          <item.Icon size={14} />
          <span className="flex-1">{item.label}</span>
          <span className="text-[11px] text-secondary_text">{item.count}</span>
        </div>
      ))}
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="text-[11px] uppercase tracking-widest text-secondary_text">
          Collections
        </div>
        <FaPlus size={12} className="text-secondary_text" />
      </div>
      <div className="mt-1 flex flex-col gap-0.5">
        {collections.map((c, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] ${
              i === 0
                ? "bg-white/[0.06] text-white"
                : "text-theme_secondary_white"
            }`}
          >
            <IoChevronForward
              size={12}
              className={i === 0 ? "rotate-90" : ""}
            />
            <span
              className="w-2 h-2 rounded-sm"
              style={{ background: c.color }}
            />
            <span className="flex-1 truncate">{c.name}</span>
            {c.locked && <FaLock size={11} className="text-secondary_text" />}
            <span className="text-[11px] text-secondary_text">{c.count}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function MockMain() {
  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10 bg-[#0d0d0d]">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="w-2 h-2 rounded-sm bg-primary" />
          <span className="font-medium">Design Systems</span>
          <span className="text-secondary_text">· 42 links</span>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-[12px] text-secondary_text w-55">
          <FaMagnifyingGlass size={12} />
          <span>Search this collection</span>
          <span className="ml-auto text-[10px] border border-white/15 rounded px-1.5 py-0.5">
            ⌘ K
          </span>
        </div>
        <div className="lp-btn-primary text-[12px] text-white rounded-md px-3 py-1.5 inline-flex items-center gap-1.5 cursor-pointer select-none">
          <FaPlus size={12} /> Add link
        </div>
      </div>

      {/* Link cards */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {mockLinks.map((l, i) => (
          <div
            key={i}
            className="rounded-lg border border-white/10 bg-[#141414] overflow-hidden hover:border-white/20 transition"
          >
            <div className="lp-lc-thumb h-24 relative">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(120% 80% at 30% 20%, hsla(${l.hue}, 60%, 50%, 0.18), transparent 60%)`,
                }}
              />
              <div className="absolute left-3 top-3 text-[10px] uppercase tracking-widest text-secondary_text bg-black/40 backdrop-blur px-1.5 py-0.5 rounded border border-white/10">
                {l.tag}
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 text-[11px] text-secondary_text">
                <span
                  className="w-3.5 h-3.5 rounded-sm"
                  style={{ background: `hsl(${l.hue},60%,55%)` }}
                />
                {l.site}
              </div>
              <div className="text-[13px] font-medium text-white leading-snug mt-1 line-clamp-2">
                {l.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ProductMockup = () => {
  return (
    <section
      id="preview"
      className="relative py-16 md:py-24 bg-theme_primary_black "
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="text-center max-w-[720px] mx-auto">
          <div className="text-xs tracking-widest uppercase text-primary/90 font-medium">
            The Workspace
          </div>
          <h2 className="mt-3 text-[1.75rem] md:text-[2.5rem] font-semibold tracking-tight leading-tight lp-text-grad">
            A workspace built for how you actually browse.
          </h2>
          <p className="mt-4 text-secondary_text text-base max-w-[560px] mx-auto">
            Collections, rich previews, fast search. Nothing you don't need.
          </p>
        </div>

        <div className="relative mt-12 md:mt-16">
          <div className="absolute inset-x-10 -top-10 h-[280px] lp-radial-blob-soft pointer-events-none" />
          <div className="relative mx-auto max-w-295 rounded-xl border border-white/15 overflow-hidden shadow-2xl shadow-black bg-[#0d0d0d]">
            {/* Browser chrome */}
            <div className="bg-theme_secondary_black h-9 flex items-center px-3 gap-1.5 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-[#ed6a5e]" />
              <span className="w-3 h-3 rounded-full bg-[#f4bf4f]" />
              <span className="w-3 h-3 rounded-full bg-[#61c554]" />
              <div className="mx-auto flex items-center gap-2 text-[11px] text-secondary_text bg-black/40 border border-white/10 rounded-md px-3 py-1">
                <FaLock size={10} />
                onelink.app/collections/design-systems
              </div>
              <div className="w-11" />
            </div>
            {/* Body */}
            <div className="flex min-h-[460px]">
              <MockSidebar />
              <MockMain />
            </div>
            {/* Bottom fade */}
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(11,11,11,0.85))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductMockup;
