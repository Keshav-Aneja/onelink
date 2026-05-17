import { cn } from "@lib/tailwind-utils";
import type { RssSubscriptionWithUnread } from "@onelink/entities/models";
import { BiTrash } from "react-icons/bi";
import { MdOutlineRssFeed } from "react-icons/md";
import { HiExclamationTriangle } from "react-icons/hi2";

interface FeedCardProps {
  subscription: RssSubscriptionWithUnread;
  unreadCount: number;
  onRemove: (id: string) => void;
  onClick: (id: string) => void;
  isSelected?: boolean;
  isRemoving?: boolean;
}

const timeAgo = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

const FeedCard = ({
  subscription,
  unreadCount,
  onRemove,
  onClick,
  isSelected = false,
  isRemoving = false,
}: FeedCardProps) => {
  const isHealthy = !subscription.last_error;
  const lastFetched = subscription.last_fetched_at
    ? new Date(subscription.last_fetched_at)
    : null;

  const displayTitle = subscription.title || (() => {
    try { return new URL(subscription.feed_url).hostname; } catch { return subscription.feed_url; }
  })();

  return (
    <div
      className={cn(
        "group relative w-full px-3 py-3 rounded-lg cursor-pointer transition-all duration-150 flex items-center gap-3",
        isSelected
          ? "bg-theme_secondary_black"
          : "hover:bg-theme_secondary_black/60",
      )}
      onClick={() => onClick(subscription.id)}
    >
      {/* Selected indicator */}
      {isSelected && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
      )}

      {/* Favicon / icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-black/40 flex items-center justify-center overflow-hidden">
        {subscription.favicon_url ? (
          <img
            src={subscription.favicon_url}
            alt=""
            className="w-5 h-5 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <MdOutlineRssFeed className="text-primary text-base" />
        )}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-tight">{displayTitle}</p>
        <p className="text-xs text-secondary_text mt-0.5 flex items-center gap-1.5">
          {isHealthy ? (
            lastFetched ? (
              <span>{timeAgo(lastFetched)} ago</span>
            ) : (
              <span>Never fetched</span>
            )
          ) : (
            <span className="flex items-center gap-1 text-red-400">
              <HiExclamationTriangle className="text-xs" />
              Error
            </span>
          )}
        </p>
      </div>

      {/* Right side: unread badge + actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {unreadCount > 0 && (
          <span className="group-hover:hidden min-w-[1.25rem] h-5 px-1 rounded-full bg-primary/20 text-primary text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {/* Action buttons – shown on hover */}
        <div
          className="hidden group-hover:flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="p-1 rounded text-secondary_text hover:text-red-400 hover:bg-red-500/10 transition-colors"
            disabled={isRemoving}
            onClick={() => onRemove(subscription.id)}
            title="Unsubscribe"
          >
            <BiTrash className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
