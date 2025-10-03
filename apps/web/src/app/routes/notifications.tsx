import NotificationListItem from "@components/cards/notification-list-item-card";
import NotificationListItemSkeleton from "@components/loaders/notification-list-item-skeleton";
import Mascot from "@components/mascot";
import { getFeed } from "@store/slices/application-slice";
import { useAppSelector } from "@store/store";
import CollectionWrapper from "@wrappers/collections-wrapper";

const Notifications = () => {
  const notifications = useAppSelector(getFeed);

  return (
    <CollectionWrapper>
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-medium">Notifications</h1>
        <p className="text-sm text-theme_secondary_white w-1/2">
          All your notifications, streamlined in one place. Receive real-time
          updates from your stored sites via RSS/Atom feeds and access the
          latest content from the past 24 hours.
        </p>
      </section>
      <section className="flex flex-col gap-2 my-4">
        {!notifications &&
          [1, 2, 3].map((_i) => <NotificationListItemSkeleton key={_i} />)}
        {notifications &&
          notifications.map((notification) => (
            <NotificationListItem data={notification} />
          ))}
        {notifications?.length === 0 && (
          <Mascot>Nothing to see here—check back later!</Mascot>
        )}
      </section>
    </CollectionWrapper>
  );
};

export default Notifications;
