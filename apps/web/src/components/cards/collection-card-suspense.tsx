import { BiSolidFolder } from "react-icons/bi";
import GlowCard from "./glow-card";

const CollectionCardSuspense = () => {
  return (
    <GlowCard
      className="w-full min-h-10 md:min-h-12 md:h-32 xxl:h-40 rounded-none md:rounded-md before:md:rounded-md after:md:rounded-md before:w-full before:h-40 before:md:h-60 border-b-[1px] border-x-0 md:border-[2px] border-white/20 text-white opacity-50 cursor-progress animate-pulse duration-300 ease-linear"
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-row md:flex-col gap-2 rounded-none md:rounded-md justify-start md:justify-center"
    >
      <BiSolidFolder className="text-xl md:text-7xl xxl:text-8xl text-theme_secondary_white" />
      <div className="h-3 md:h-5 w-40 md:w-32 bg-white/20 rounded animate-pulse"></div>
    </GlowCard>
  );
};

export default CollectionCardSuspense;
