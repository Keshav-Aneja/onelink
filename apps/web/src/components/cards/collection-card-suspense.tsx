import { BiSolidFolder } from "react-icons/bi";
import GlowCard from "./glow-card";

const CollectionCardSuspense = () => {
  return (
    <GlowCard
      className="w-full h-32 xxl:h-40 rounded-md before:rounded-md after:rounded-md before:w-full before:h-60 border-[2px] border-white/20 text-white opacity-50 cursor-progress animate-pulse duration-300 ease-linear"
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-col gap-2 rounded-md"
    >
      <BiSolidFolder className="text-7xl xxl:text-8xl text-theme_secondary_white" />
      <p className="text-base xxl:text-lg select-none w-ful"></p>
    </GlowCard>
  );
};

export default CollectionCardSuspense;
