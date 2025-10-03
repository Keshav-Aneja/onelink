import Button from "@components/buttons/button";
import { Link } from "react-router";
import { BiCalendar, BiTime } from "react-icons/bi";
import { GoLinkExternal } from "react-icons/go";
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
  return (
    <div className="w-full px-4 py-4 rounded-md border-theme_secondary_white/30 border-1 hover:bg-theme_secondary_black/30 cursor-pointer flex items-center justify-between border-l-6 border-l-primary">
      <section>
        <h2 className="text-xl font-semibold truncate mb-3">{data.title}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BiCalendar className="w-3.5 h-3.5" />
            <span>
              {pubDate?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <BiTime className="w-3.5 h-3.5" />
            <span>
              {pubDate?.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </section>
      <Link to={data.link ?? ""} target="_blank">
        <Button>
          Open <GoLinkExternal />
        </Button>
      </Link>
    </div>
  );
};

export default NotificationListItem;
