import { useNavigate } from "react-router";
import GlowCard from "./glow-card";
import { BiSolidFolder } from "react-icons/bi";
import { Collection } from "@onelink/entities/models";
import { useAppDispatch } from "@store/store";
import { PiPencilSimpleLight } from "react-icons/pi";
import { cn } from "@lib/tailwind-utils";
import { setSelectedCollection } from "@store/slices/application-slice";
interface CollectionCardProps {
  data: Collection;
}
const CollectionCard = ({ data }: CollectionCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <GlowCard
      className="w-full h-32 xxl:h-40 rounded-md before:rounded-md after:rounded-md before:w-full before:h-60 border-[2px] border-white/20 text-white cursor-pointer group --collection-box"
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-col gap-2 rounded-md"
      onDoubleClick={() => {
        navigate(data.name);
      }}
    >
      <button
        className={cn(
          "bg-black text-theme_secondary_white/70 hover:text-white absolute top-2 right-2 rounded-full p-1 xxl:p-1.5 text-sm xxl:text-base cursor-pointer hover:bg-primary transition-all duration-200 ease-linear --edit",
        )}
        onClick={() => {
          dispatch(setSelectedCollection(data));
        }}
      >
        <PiPencilSimpleLight />
      </button>

      <BiSolidFolder className="text-7xl xxl:text-8xl text-theme_secondary_white" />
      <p className="text-base xxl:text-lg select-none">{data.name}</p>
    </GlowCard>
  );
};

export default CollectionCard;
