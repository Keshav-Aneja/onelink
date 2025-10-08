import GlowCard from "./glow-card";
import Button from "@components/buttons/button";

const LinkCardSuspense = () => {
  return (
    <GlowCard
      className="w-full h-[13rem] md:h-[15rem] xxl:h-[17rem] rounded-md before:rounded-md after:rounded-md before:w-full before:h-60 border-[2px] border-white/20 text-white animate-pulse duration-300 ease-linear cursor-progress"
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-col gap-2 rounded-md p-2 justify-between items-start"
    >
      <div className="w-full flex flex-col gap-2">
        <section className="w-full aspect-[1.91]  rounded-md overflow-hidden bg-theme_secondary_black relative flex items-center justify-center select-none"></section>
        <span>
          <p className="text-sm xxl:text-base font-semibold line-clamp-2 text-theme_secondary_white select-none bg-theme_secondary_black h-4"></p>
          <p className="text-sm xxl:text-base font-semibold line-clamp-2 text-theme_secondary_white select-none bg-theme_secondary_black h-4 mt-1"></p>
          <p className="text-xs text-theme_secondary_white/70 line-clamp-2 h-8 bg-theme_secondary_black/60 mt-3"></p>
        </span>
      </div>
      <section className="w-full flex justify-between items-center">
        <p className="text-secondary_text text-xs xxl:text-sm bg-theme_secondary_black/60 h-4 w-2/5"></p>
        <Button
          className="text-xs xxl:text-sm py-1 hover:bg-primary focus:bg-primary w-2/5  h-8 bg-theme_secondary_black opacity-50 cursor-progress"
          disabled
        >
          &nbsp;
        </Button>
      </section>
    </GlowCard>
  );
};

export default LinkCardSuspense;
