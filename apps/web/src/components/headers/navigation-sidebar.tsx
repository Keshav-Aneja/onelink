import SidebarButton from "@components/buttons/sidebar-button";
import sidebarItems from "@config/navigation-sidebar-items";
import { useNotifications } from "@features/feeds/get-feed-items";
import { useReadHashes } from "@features/feeds/get-read-hashes";
import { useSubscriptions } from "@features/feeds/get-subscriptions";
import { useMemo } from "react";

const NavigationSidebar = () => {
  const subsQuery = useSubscriptions();
  const subs = subsQuery.data?.data ?? [];

  const notificationsQuery = useNotifications(
    { sinceDays: 1 },
    { queryConfig: { enabled: subs.length > 0 } },
  );
  const readHashesQuery = useReadHashes();

  const feedsUnreadCount = useMemo(() => {
    const items = notificationsQuery.data?.data ?? [];
    const readSet = new Set(readHashesQuery.data?.data ?? []);
    return items.filter((i) => i.item_hash && !readSet.has(i.item_hash)).length;
  }, [notificationsQuery.data, readHashesQuery.data]);

  return (
    <aside className="w-full h-full flex flex-col items-center gap-4">
      <img
        src="/images/logo.webp"
        alt="OneLink"
        className="w-full h-auto hue-rotate-90"
      />
      {sidebarItems.map((item) => (
        <SidebarButton
          key={item.label}
          item={item}
          badge={item.label === "Feeds" ? feedsUnreadCount : undefined}
        />
      ))}
    </aside>
  );
};
export default NavigationSidebar;
