import { FaFolder, FaBookmark, FaPuzzlePiece } from "react-icons/fa6";
import type { IconType } from "react-icons";

type FeatureCardProps = {
  Icon: IconType;
  title: string;
  body: string;
  kbd?: string[];
};

function FeatureCard({ Icon, title, body, kbd }: FeatureCardProps) {
  return (
    <div className="lp-glow-card lp-lift p-6 md:p-7">
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
          <Icon size={22} />
        </div>
        <div className="mt-5 text-[1.05rem] font-semibold text-white">
          {title}
        </div>
        <p className="mt-2 text-[13.5px] text-secondary_text leading-relaxed">
          {body}
        </p>
        {kbd && (
          <div className="mt-5 flex items-center gap-1.5 text-[11px] text-secondary_text font-mono">
            {kbd.map((k, i) => (
              <span
                key={i}
                className="border border-white/15 bg-white/[0.03] rounded px-1.5 py-0.5"
              >
                {k}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const secondaryFeatures: [string, string][] = [
  ["Full-text search", "Search inside saved pages, not just titles."],
  ["Keyboard-first", "Every action has a shortcut. No mouse required."],
  ["Public collections", "Share a curated list with a single link."],
  ["Self-host or cloud", "Bring your own server, or just sign up."],
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative py-20 md:py-28 bg-theme_primary_black"
    >
      <div className="mx-auto max-w-295 mx-auto">
        <div className="max-w-[720px]">
          <div className="text-xs tracking-widest uppercase text-primary/90 font-medium">
            Features
          </div>
          <h2 className="mt-3 text-[1.75rem] md:text-[2.5rem] font-semibold tracking-tight leading-tight lp-text-grad">
            Everything you need to own your web.
          </h2>
          <p className="mt-4 text-secondary_text text-base max-w-[520px]">
            No more lost tabs or messy bookmark folders. Just a calm, fast,
            keyboard-first home for the web you care about.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            Icon={FaFolder}
            title="Organize with Collections"
            body="Group links into named, nested collections. Add descriptions, lock them with passwords, share them publicly — or keep them entirely yours."
            kbd={["⌘", "N"]}
          />
          <FeatureCard
            Icon={FaBookmark}
            title="Rich Link Previews"
            body="Every link is saved with its Open Graph image, title, and description — so you always know what you're clicking before you click it."
            kbd={["Space", "to preview"]}
          />
          <FeatureCard
            Icon={FaPuzzlePiece}
            title="Capture from Anywhere"
            body="The OneLink browser extension saves any page to your collections in one click — without switching tabs or breaking your flow."
            kbd={["⌘", "⇧", "K"]}
          />
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px]">
          {secondaryFeatures.map(([title, desc], i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition"
            >
              <div className="text-white font-medium">{title}</div>
              <div className="mt-1 text-secondary_text text-[12.5px] leading-relaxed">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
