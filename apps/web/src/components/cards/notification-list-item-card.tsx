import Button from "@components/buttons/button";
import { Link } from "react-router";
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
    <div className="w-full px-4 py-4 rounded-md border-theme_secondary_white/50 border-1 hover:bg-theme_secondary_black cursor-pointer flex items-center justify-between">
      <span>
        <h2 className="text-base font-medium truncate">{data.title}</h2>
        <p className="text-theme_secondary_white text-sm">
          {pubDate?.toLocaleTimeString()} - {pubDate?.toLocaleDateString()}
        </p>
      </span>
      <Link to={data.link ?? ""} target="_blank">
        <Button>See More</Button>
      </Link>
    </div>
  );
};

export default NotificationListItem;
