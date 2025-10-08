import { useNavigate } from "react-router";
import GlowCard from "./glow-card";
import { BiSolidFolder } from "react-icons/bi";
import { Collection } from "@onelink/entities/models";
import { useAppDispatch } from "@store/store";
import { PiPencilSimpleLight } from "react-icons/pi";
import { cn } from "@lib/tailwind-utils";
import { setSelectedCollection } from "@store/slices/application-slice";
import DeleteCollectionButton from "@components/buttons/delete-collection-button";
interface CollectionCardProps {
  data: Collection;
}
const CollectionCard = ({ data }: CollectionCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <GlowCard
      className="w-full min-h-10 md:min-h-12 md:h-32 xxl:h-40 rounded-none md:rounded-md before:md:rounded-md after:md:rounded-md before:w-full before:h-40 before:md:h-60 border-b-[1px] border-x-0 md:border-[2px] border-white/20 text-white cursor-pointer group --collection-box"
      style={{ "--color-gradient": "red" }}
      containerClassName="flex-row md:flex-col gap-2 rounded-none md:rounded-md justify-start md:justify-center"
      onDoubleClick={() => {
        navigate(data.name);
      }}
    >
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          className={cn(
            "bg-black text-theme_secondary_white/70 hover:text-white rounded-full p-1 xxl:p-1.5 text-sm xxl:text-base cursor-pointer hover:bg-primary transition-all duration-200 ease-linear --edit",
          )}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setSelectedCollection(data));
          }}
        >
          <PiPencilSimpleLight />
        </button>
        <DeleteCollectionButton id={data.id} name={data.name} />
      </div>

      <BiSolidFolder className="text-xl md:text-7xl xxl:text-8xl text-theme_secondary_white" />
      <p className="text-xs md:text-base xxl:text-lg select-none truncate w-fit md:w-[90%] text-center">
        {data.name}
      </p>
    </GlowCard>
  );
};

export default CollectionCard;
