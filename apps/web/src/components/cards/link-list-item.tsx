import { Link } from "@onelink/entities/models";
import { RiFileMarkedFill } from "react-icons/ri";
import StarButton from "@components/buttons/star-button";
import DeleteLinkButton from "@components/buttons/delete-link-button";
import SubscribeButton from "@components/buttons/subscribe-button";
import formatLink from "@lib/utils/format-link";
import { MoveToCollectionModal } from "@components/dialogs/move-to-collection-modal";
import { useState } from "react";
import { TbFolderShare } from "react-icons/tb";

interface LinkListItemProps {
  data: Link;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

export default function LinkListItem({ data, isSelected, onSelect }: LinkListItemProps) {
  const [moveOpen, setMoveOpen] = useState(false);
  const selectionMode = !!onSelect;

  return (
    <>
    <div
      className={`w-full flex items-center gap-3 px-3 py-2.5 border-b border-white/8 transition-colors duration-150 group cursor-pointer ${isSelected ? "bg-primary/8 border-l-2 border-l-primary" : "hover:bg-white/4"}`}
      onDoubleClick={() => !selectionMode && window.open(data.link, "_blank")}
      onClick={onSelect}
    >
      {/* Checkbox in selection mode */}
      {selectionMode && (
        <span
          className={`shrink-0 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-150`}
          onClick={(e) => { e.stopPropagation(); onSelect?.(e); }}
        >
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={() => {}}
            className="w-3.5 h-3.5 accent-primary cursor-pointer"
          />
        </span>
      )}
      {/* OG image thumbnail */}
      <div className="shrink-0 w-20 h-12 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
        {data.open_graph && data.open_graph.length > 0 ? (
          <img
            src={data.open_graph}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <RiFileMarkedFill className="text-xl text-white/30" />
        )}
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-white truncate leading-tight">
          {data.name || formatLink(data.link)}
        </p>
        <p className="text-[0.65rem] text-primary/80 truncate">
          {formatLink(data.link)}
        </p>
        {data.site_description && (
          <p className="text-[0.65rem] text-white/40 line-clamp-1 leading-relaxed">
            {data.site_description}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {data.rss && data.rss.length > 0 && (
          <span className="text-[0.55rem] px-1.5 py-0.5 rounded border border-orange-500/40 text-orange-400/80 bg-orange-500/10">
            RSS
          </span>
        )}
        {data.subscribed && (
          <span className="text-[0.55rem] px-1.5 py-0.5 rounded border border-primary/40 text-primary/80 bg-primary/10">
            Subscribed
          </span>
        )}
      </div>

      {/* Actions — hidden in selection mode */}
      {!selectionMode && (
        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <StarButton starred={data.is_starred ?? false} id={data.id} subtle />
          <SubscribeButton subscribed={data.subscribed ?? false} id={data.id} subtle />
          <button
            className="text-sm cursor-pointer text-theme_secondary_white/40 hover:text-theme_secondary_white transition-colors"
            title="Move to collection"
            onClick={(e) => {
              e.stopPropagation();
              setMoveOpen(true);
            }}
          >
            <TbFolderShare />
          </button>
          <DeleteLinkButton id={data.id} subtle />
        </div>
      )}
    </div>
    {moveOpen && (
      <MoveToCollectionModal link={data} onClose={() => setMoveOpen(false)} />
    )}
    </>
  );
}
