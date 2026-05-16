import { Link } from "@onelink/entities/models";
import { RiFileMarkedFill } from "react-icons/ri";
import StarButton from "@components/buttons/star-button";
import DeleteLinkButton from "@components/buttons/delete-link-button";
import Button from "@components/buttons/button";
import { useAppDispatch } from "@store/store";
import { setSelectedLink } from "@store/slices/application-slice";
import formatLink from "@lib/utils/format-link";

interface LinkListItemProps {
  data: Link;
}

export default function LinkListItem({ data }: LinkListItemProps) {
  const dispatch = useAppDispatch();

  return (
    <div
      className="w-full flex items-center gap-3 px-3 py-2.5 border-b border-white/8 hover:bg-white/4 transition-colors duration-150 group"
      onDoubleClick={() => window.open(data.link, "_blank")}
    >
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

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <StarButton starred={data.is_starred ?? false} id={data.id} />
        <Button
          className="text-[0.6rem] py-0.5 px-2 hover:bg-primary focus:bg-primary"
          onClick={() => dispatch(setSelectedLink(data))}
        >
          Detail
        </Button>
        <DeleteLinkButton id={data.id} />
      </div>
    </div>
  );
}
