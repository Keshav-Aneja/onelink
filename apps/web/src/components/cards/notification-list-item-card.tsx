import { BiCalendar } from "react-icons/bi";
import type { RSSFeed } from "@onelink/entities/models";

interface NotificationProps {
  data: RSSFeed;
}

const NotificationListItem = ({ data }: NotificationProps) => {
  if (!data) return null;
  let pubDate: Date | null = null;
  if (data.published_date) {
    pubDate = new Date(data.published_date);
  }

  const dateStr = pubDate?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timeStr = pubDate?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full px-4 py-3.5 rounded-lg hover:bg-theme_secondary_black/50 cursor-pointer transition-all duration-150 border border-transparent hover:border-white/5">
      <h2 className="text-sm font-medium leading-snug mb-1">{data.title}</h2>
      {pubDate && (
        <div className="flex items-center gap-1.5 text-xs text-secondary_text">
          <BiCalendar className="flex-shrink-0" />
          <span>{dateStr}</span>
          <span className="text-secondary_text/40">·</span>
          <span>{timeStr}</span>
        </div>
      )}
    </div>
  );
};

export default NotificationListItem;
