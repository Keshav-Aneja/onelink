import NotificationListItem from "@components/cards/notification-list-item-card";
import NotificationListItemSkeleton from "@components/loaders/notification-list-item-skeleton";
import Mascot from "@components/mascot";
import { getFeed, setFeed } from "@store/slices/application-slice";
import { useAppDispatch, useAppSelector } from "@store/store";
import CollectionWrapper from "@wrappers/collections-wrapper";
import { useFeed } from "@features/feed/get-feed";
import { useEffect, useState } from "react";

const Notifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(getFeed);

  // Time range options
  const timeRanges = [
    { label: "Last 24 hours", days: 1 },
    { label: "Last week", days: 7 },
    { label: "Last month", days: 30 },
    { label: "Last 3 months", days: 90 },
    { label: "Last 6 months", days: 180 },
    { label: "Last year", days: 365 },
    { label: "Last 5 years", days: 1825 },
  ];

  const [sinceDays, setSinceDays] = useState(1);

  const feed = useFeed({ sinceDays });

  useEffect(() => {
    if (feed.isSuccess && feed.data?.data) {
      dispatch(setFeed(feed.data.data));
    }
  }, [feed, dispatch]);

  return (
    <CollectionWrapper>
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-medium">Notifications</h1>
        <p className="text-sm text-theme_secondary_white w-1/2">
          All your notifications, streamlined in one place. Receive real-time
          updates from your stored sites via RSS/Atom feeds and access the
          latest content.
        </p>
      </section>

      {/* Filter Controls */}
      <section className="flex flex-col gap-3 my-4 p-4 bg-theme_secondary_black rounded-lg">
        <div className="flex gap-2 items-center">
          <label className="text-sm text-theme_secondary_white">Time range:</label>
          <select
            value={sinceDays}
            onChange={(e) => setSinceDays(Number(e.target.value))}
            className="px-4 py-2 bg-black/30 rounded-md text-sm border border-white/20 focus:border-primary focus:outline-none cursor-pointer hover:bg-black/40 transition-colors"
          >
            {timeRanges.map((range) => (
              <option key={range.days} value={range.days} className="bg-theme_secondary_black">
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="flex flex-col gap-2 my-4">
        {feed.isLoading &&
          [1, 2, 3].map((_i) => <NotificationListItemSkeleton key={_i} />)}
        {notifications &&
          notifications.map((notification, index) => (
            <NotificationListItem key={index} data={notification} />
          ))}
        {notifications?.length === 0 && (
          <Mascot>Nothing to see here—check back later!</Mascot>
        )}
      </section>
    </CollectionWrapper>
  );
};

export default Notifications;
