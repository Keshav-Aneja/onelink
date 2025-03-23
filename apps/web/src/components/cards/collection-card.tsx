import { useNavigate } from "react-router";
import GlowCard from "./glow-card";
import { BiSolidFolder } from "react-icons/bi";
import { Collection } from "@onelink/entities/models";
interface CollectionCardProps {
  data: Collection;
}
const CollectionCard = ({ data }: CollectionCardProps) => {
  const navigate = useNavigate();
  return (
    <GlowCard
      className="w-full h-32 xxl:h-40 rounded-md before:rounded-md after:rounded-md before:w-full before:h-60 border-[2px] border-white/20 text-white cursor-pointer "
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-col gap-2 rounded-md"
      onDoubleClick={() => {
        navigate(data.name);
      }}
    >
      <BiSolidFolder className="text-7xl xxl:text-8xl text-theme_secondary_white" />
      <p className="text-base xxl:text-lg select-none">{data.name}</p>
    </GlowCard>
  );
};

export default CollectionCard;
