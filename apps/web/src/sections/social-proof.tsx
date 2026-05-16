const stats = [
  { value: "Open Source", label: "Built in public" },
  { value: "Free to Use", label: "No credit card" },
  { value: "Chrome & Firefox", label: "Browser extension" },
  { value: "Privacy First", label: "Zero tracking" },
];

const SocialProof = () => {
  return (
    <section className="relative py-16 md:py-20 border-y border-white/10 bg-black/30">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10">
        <p className="text-center text-secondary_text italic text-sm">
          "Built for people who take the web seriously."
        </p>
        <div className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0">
          {stats.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center gap-1.5">
              <div className="text-xl md:text-2xl font-semibold text-white tracking-tight">{item.value}</div>
              <div className="text-[10.5px] text-secondary_text uppercase tracking-[0.18em]">{item.label}</div>
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
