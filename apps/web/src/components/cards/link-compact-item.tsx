import { Link } from "@onelink/entities/models";
import StarButton from "@components/buttons/star-button";
import DeleteLinkButton from "@components/buttons/delete-link-button";
import Button from "@components/buttons/button";
import { useAppDispatch } from "@store/store";
import { setSelectedLink } from "@store/slices/application-slice";
import formatLink from "@lib/utils/format-link";
import extractDomain from "@lib/utils/extract-domain";
import formatDate from "@lib/utils/format-date";

interface LinkCompactItemProps {
  data: Link;
}

export default function LinkCompactItem({ data }: LinkCompactItemProps) {
  const dispatch = useAppDispatch();
  const domain = extractDomain(data.link);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;

  return (
    <div
      className="w-full flex items-center gap-3 px-3 py-2 border-b border-white/8 hover:bg-white/4 transition-colors duration-150 group cursor-pointer"
      onDoubleClick={() => window.open(data.link, "_blank")}
    >
      {/* Favicon */}
      <img
        src={faviconUrl}
        alt=""
        width={14}
        height={14}
        className="shrink-0 opacity-70 group-hover:opacity-100"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      {/* Title */}
      <p className="flex-1 min-w-0 text-xs text-white/80 group-hover:text-white truncate transition-colors">
        {data.name || formatLink(data.link)}
      </p>

      {/* Domain badge */}
      <span className="hidden md:inline shrink-0 text-[0.6rem] text-white/30 truncate max-w-[100px]">
        {formatLink(data.link)}
      </span>

      {/* RSS indicator */}
      {data.rss && data.rss.length > 0 && (
        <span className="hidden lg:inline shrink-0 text-[0.55rem] text-orange-400/70">
          RSS
        </span>
      )}

      {/* Date */}
      {data.created_at && (
        <span className="hidden lg:inline shrink-0 text-[0.6rem] text-white/25 w-24 text-right">
          {formatDate(data.created_at)}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <StarButton starred={data.is_starred ?? false} id={data.id} />
        <Button
          className="text-[0.55rem] py-0.5 px-1.5 hover:bg-primary focus:bg-primary"
          onClick={() => dispatch(setSelectedLink(data))}
        >
          Detail
        </Button>
        <DeleteLinkButton id={data.id} />
      </div>
    </div>
  );
}
