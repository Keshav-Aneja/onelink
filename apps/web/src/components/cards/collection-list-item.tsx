import { Collection } from "@onelink/entities/models";
import { BiSolidFolder } from "react-icons/bi";
import { PiPencilSimpleLight } from "react-icons/pi";
import { useNavigate } from "react-router";
import { useAppDispatch } from "@store/store";
import { setSelectedCollection } from "@store/slices/application-slice";
import DeleteCollectionButton from "@components/buttons/delete-collection-button";
import { cn } from "@lib/tailwind-utils";

interface CollectionListItemProps {
  data: Collection;
}

export default function CollectionListItem({ data }: CollectionListItemProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div
      className="w-full flex items-center gap-3 px-3 py-2.5 border-b border-white/8 hover:bg-white/4 transition-colors duration-150 group cursor-pointer"
      onDoubleClick={() => navigate(data.name)}
    >
      {/* Folder icon with collection color */}
      <div
        className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-white/5"
        style={{ color: data.color ?? undefined }}
      >
        <BiSolidFolder className="text-lg" />
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
          {data.name}
        </p>
        {data.description && (
          <p className="text-[0.65rem] text-white/35 truncate">
            {data.description}
          </p>
        )}
      </div>

      {/* Badges */}
      {data.is_protected && (
        <span className="hidden sm:inline shrink-0 text-[0.55rem] px-1.5 py-0.5 rounded border border-white/20 text-white/40">
          Protected
        </span>
      )}

      {/* Actions */}
      <div
        className={cn(
          "flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
        )}
      >
        <button
          className="bg-black text-white/50 hover:text-white rounded-full p-1 text-sm cursor-pointer hover:bg-primary transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setSelectedCollection(data));
          }}
        >
          <PiPencilSimpleLight />
        </button>
        <DeleteCollectionButton id={data.id} name={data.name} />
      </div>
    </div>
  );
}
