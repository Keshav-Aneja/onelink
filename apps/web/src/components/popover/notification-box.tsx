import CircularButton from "@components/buttons/circular-button";
import { RiNotification4Fill } from "react-icons/ri";
import Popover from "./popover";
import { cn } from "@lib/tailwind-utils";
import { BiCalendar } from "react-icons/bi";
import { GoLinkExternal } from "react-icons/go";
import type { RSSFeed } from "@onelink/entities/models";
import { useNotifications } from "@features/feeds/get-feed-items";
import { useReadHashes } from "@features/feeds/get-read-hashes";
import { useSubscriptions } from "@features/feeds/get-subscriptions";
import { useMemo } from "react";

const NotificationBox = () => {
  const subsQuery = useSubscriptions();
  const subs = subsQuery.data?.data ?? [];

  const itemsQuery = useNotifications(
    { sinceDays: 1 },
    { queryConfig: { enabled: subs.length > 0 } },
  );
  const readHashesQuery = useReadHashes();

  const serverHashes: string[] = readHashesQuery.data?.data ?? [];
  const readSet = useMemo(() => new Set(serverHashes), [serverHashes]);
  const items: RSSFeed[] = itemsQuery.data?.data ?? [];
  const unreadItems = useMemo(
    () => items.filter((i) => i.item_hash && !readSet.has(i.item_hash)),
    [items, readSet],
  );

  const isLoading = subsQuery.isLoading || itemsQuery.isLoading;

  return (
    <section className="relative">
      <Popover
        Trigger={<NotificationTrigger unreadCount={unreadItems.length} />}
        Content={({ className }) => (
          <NotificationContent
            className={className}
            isLoading={isLoading}
            unreadItems={unreadItems.slice(0, 5)}
          />
        )}
      />
    </section>
  );
};

export default NotificationBox;

function NotificationTrigger({ unreadCount }: { unreadCount: number }) {
  return (
    <CircularButton name="notifications">
      {unreadCount > 0 && (
        <span className="bg-primary w-4 h-4 rounded-full flex items-center justify-center absolute -top-1 -right-1 text-[10px] font-bold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      <RiNotification4Fill className="text-xl xxl:text-2xl" />
    </CircularButton>
  );
}

type ContentProps = {
  className?: string;
  isLoading: boolean;
  unreadItems: RSSFeed[];
};

function NotificationContent({ className, isLoading, unreadItems }: ContentProps) {
  return (
    <div className={cn(className, "w-80 xxl:w-96 p-3 z-[100] flex flex-col gap-2")}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-sm font-semibold">Unread today</span>
        {unreadItems.length > 0 && (
          <span className="text-xs text-primary font-medium">{unreadItems.length} new</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {isLoading && (
          [1, 2, 3].map((i) => (
            <div key={i} className="px-2 py-2.5 rounded-lg flex flex-col gap-1.5">
              <div className="h-3.5 w-4/5 rounded bg-theme_secondary_black animate-pulse" />
              <div className="h-2.5 w-1/3 rounded bg-theme_secondary_black/60 animate-pulse" />
            </div>
          ))
        )}

        {!isLoading && unreadItems.length === 0 && (
          <p className="text-xs text-secondary_text text-center py-6">
            All caught up — nothing new in the last 24h.
          </p>
        )}

        {!isLoading && unreadItems.map((item, i) => (
          <NotificationItem key={item.item_hash ?? i} data={item} />
        ))}
      </div>
    </div>
  );
}

function NotificationItem({ data }: { data: RSSFeed }) {
  if (!data) return null;
  const pubDate = data.published_date ? new Date(data.published_date) : null;
  const timeStr = pubDate?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <a
      href={data.link ?? ""}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between gap-3 px-2 py-2.5 rounded-lg hover:bg-theme_secondary_black/60 transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-snug line-clamp-2">{data.title}</p>
        {pubDate && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-secondary_text">
            <BiCalendar className="flex-shrink-0" />
            <span>{timeStr}</span>
          </div>
        )}
      </div>
      <GoLinkExternal className="text-secondary_text text-xs flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
