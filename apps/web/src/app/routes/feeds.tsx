import { useMemo, useState } from "react";
import CollectionWrapper from "@wrappers/collections-wrapper";
import Mascot from "@components/mascot";
import FeedCard from "@components/cards/feed-card";
import OpmlImportModal from "@components/dialogs/opml-import-modal";
import NotificationListItem from "@components/cards/notification-list-item-card";
import NotificationListItemSkeleton from "@components/loaders/notification-list-item-skeleton";
import { useSubscriptions } from "@features/feeds/get-subscriptions";
import { useUnsubscribeFeed, usePruneInactiveFeeds } from "@features/feeds/unsubscribe";
import { useSubscribeFeed } from "@features/feeds/subscribe";
import { useMarkFeedRead, useMarkAllFeedsRead } from "@features/feeds/mark-read";
import { useFeedItems } from "@features/feeds/get-feed-items";
import { useReadHashes } from "@features/feeds/get-read-hashes";
import { exportOpml } from "@features/feeds/opml";
import type { RSSFeed } from "@onelink/entities/models";
import { MdOutlineRssFeed } from "react-icons/md";
import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiPlus,
  HiXMark,
  HiCheck,
  HiOutlineArchiveBoxXMark,
} from "react-icons/hi2";

const TIME_RANGES = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "3mo", days: 90 },
];

const Feeds = () => {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [sinceDays, setSinceDays] = useState(7);
  const [showImportModal, setShowImportModal] = useState(false);
  const [addUrl, setAddUrl] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [localReadHashes, setLocalReadHashes] = useState<Set<string>>(new Set());

  const subsQuery = useSubscriptions();
  const subs = subsQuery.data?.data ?? [];

  const readHashesQuery = useReadHashes();
  const serverReadHashes: string[] = readHashesQuery.data?.data ?? [];

  const readHashes = useMemo(() => {
    const merged = new Set(serverReadHashes);
    localReadHashes.forEach((h) => merged.add(h));
    return merged;
  }, [serverReadHashes, localReadHashes]);

  const itemsQuery = useFeedItems(
    { sinceDays, feedId: selectedFeedId ?? undefined },
    { queryConfig: { enabled: subs.length > 0 } },
  );
  const items: RSSFeed[] = itemsQuery.data?.data ?? [];

  const unreadByFeed = new Map<string, number>();
  for (const item of items) {
    if (item.feed_id && item.item_hash && !readHashes.has(item.item_hash)) {
      unreadByFeed.set(item.feed_id, (unreadByFeed.get(item.feed_id) ?? 0) + 1);
    }
  }

  const unsubscribeMutation = useUnsubscribeFeed({});
  const pruneInactiveMutation = usePruneInactiveFeeds({});
  const subscribeMutation = useSubscribeFeed({});
  const markReadMutation = useMarkFeedRead({
    mutationConfig: {
      onSuccess: (_, vars) => {
        setLocalReadHashes((prev) => {
          const next = new Set(prev);
          vars.item_hashes.forEach((h) => next.add(h));
          return next;
        });
      },
    },
  });
  const markAllReadMutation = useMarkAllFeedsRead({
    mutationConfig: {
      onSuccess: () => {
        const allHashes = items.map((i) => i.item_hash).filter(Boolean) as string[];
        setLocalReadHashes((prev) => {
          const next = new Set(prev);
          allHashes.forEach((h) => next.add(h));
          return next;
        });
      },
    },
  });

  const handleMarkFeedRead = (feedId: string) => {
    const hashes = items
      .filter((i) => i.feed_id === feedId && i.item_hash && !readHashes.has(i.item_hash))
      .map((i) => i.item_hash as string);
    markReadMutation.mutate({ item_hashes: hashes });
  };

  const handleExportOpml = async () => {
    const blob = await exportOpml();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onelink-feeds.opml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddFeed = () => {
    if (!addUrl.trim()) return;
    subscribeMutation.mutate(
      { url: addUrl.trim() },
      {
        onSuccess: () => {
          setAddUrl("");
          setShowAddInput(false);
        },
      },
    );
  };

  const visibleItems = selectedFeedId
    ? items.filter((i) => i.feed_id === selectedFeedId)
    : items;

  const totalUnread = items.filter(
    (i) => i.item_hash && !readHashes.has(i.item_hash),
  ).length;

  const selectedFeedTitle = selectedFeedId
    ? subs.find((s) => s.id === selectedFeedId)?.title ?? "Feed"
    : "All feeds";

  return (
    <CollectionWrapper hideBreadcrumbs selfScroll>
      {/* Page header */}
      <section className="flex items-start justify-between gap-4 mb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MdOutlineRssFeed className="text-primary text-lg" />
            <h1 className="text-xl font-semibold tracking-tight">Feeds</h1>
            {subs.length > 0 && (
              <span className="text-xs text-secondary_text bg-theme_secondary_black px-2 py-0.5 rounded-full">
                {subs.length}
              </span>
            )}
            {totalUnread > 0 && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {totalUnread} unread
              </span>
            )}
          </div>
          <p className="text-xs text-secondary_text">
            RSS subscriptions, feed health, and OPML import/export.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {subs.length > 0 && (
            <button
              className="flex items-center gap-1.5 text-xs text-secondary_text hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={pruneInactiveMutation.isPending}
              onClick={() => pruneInactiveMutation.mutate()}
              title="Remove feeds with no items in the last 3 months"
            >
              <HiOutlineArchiveBoxXMark />
              {pruneInactiveMutation.isPending ? "Removing…" : "Remove inactive"}
            </button>
          )}
          <button
            className="flex items-center gap-1.5 text-xs text-secondary_text hover:text-white px-3 py-1.5 rounded-md hover:bg-theme_secondary_black transition-colors"
            onClick={() => setShowImportModal(true)}
          >
            <HiArrowUpTray /> Import
          </button>
          <button
            className="flex items-center gap-1.5 text-xs text-secondary_text hover:text-white px-3 py-1.5 rounded-md hover:bg-theme_secondary_black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleExportOpml}
            disabled={subs.length === 0}
          >
            <HiArrowDownTray /> Export
          </button>
          {totalUnread > 0 && (
            <button
              className="flex items-center gap-1.5 text-xs text-secondary_text hover:text-white px-3 py-1.5 rounded-md hover:bg-theme_secondary_black transition-colors disabled:opacity-40"
              disabled={markAllReadMutation.isPending}
              onClick={() => markAllReadMutation.mutate({ sinceDays })}
            >
              <HiCheck />
              {markAllReadMutation.isPending ? "Marking…" : "Mark all read"}
            </button>
          )}
          <button
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors"
            onClick={() => setShowAddInput((v) => !v)}
          >
            <HiPlus /> Add feed
          </button>
        </div>
      </section>

      {/* Add feed input */}
      {showAddInput && (
        <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg bg-theme_secondary_black border border-white/8">
          <MdOutlineRssFeed className="text-secondary_text text-base flex-shrink-0" />
          <input
            type="url"
            placeholder="https://example.com/feed.xml"
            value={addUrl}
            onChange={(e) => setAddUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddFeed()}
            className="flex-1 bg-transparent outline-none text-sm placeholder-secondary_text/40"
            autoFocus
          />
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-md text-secondary_text hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => { setShowAddInput(false); setAddUrl(""); }}
            >
              <HiXMark className="text-sm" />
            </button>
            <button
              className="text-xs font-medium text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors disabled:opacity-40"
              disabled={subscribeMutation.isPending || !addUrl.trim()}
              onClick={handleAddFeed}
            >
              {subscribeMutation.isPending ? "Adding…" : "Subscribe"}
            </button>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {subsQuery.isLoading && (
        <div className="flex flex-col gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-theme_secondary_black/60 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!subsQuery.isLoading && subs.length === 0 && (
        <Mascot>No feeds yet — add a URL above or import an OPML file</Mascot>
      )}

      {/* Main layout: sidebar + items */}
      {subs.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 xl:w-64 flex-shrink-0 flex flex-col min-h-0">
            <div className="bg-theme_secondary_black/30 rounded-xl p-2 flex flex-col flex-1 min-h-0">
              {/* All feeds row — sticky inside the panel */}
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 flex-shrink-0 ${
                  selectedFeedId === null
                    ? "bg-theme_secondary_black"
                    : "hover:bg-theme_secondary_black/60"
                }`}
                onClick={() => setSelectedFeedId(null)}
              >
                {selectedFeedId === null && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
                )}
                <div className="w-8 h-8 rounded-md bg-black/40 flex items-center justify-center flex-shrink-0">
                  <MdOutlineRssFeed className="text-primary text-base" />
                </div>
                <span className="text-sm font-medium flex-1">All feeds</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5 mx-2 my-1 flex-shrink-0" />

              {/* Scrollable feed list */}
              <div className="flex flex-col gap-0.5 overflow-y-auto scrollbar-none">
                {subs.map((sub) => (
                  <FeedCard
                    key={sub.id}
                    subscription={sub}
                    unreadCount={unreadByFeed.get(sub.id) ?? 0}
                    isSelected={selectedFeedId === sub.id}
                    isRemoving={unsubscribeMutation.isPending}
                    onClick={setSelectedFeedId}
                    onRemove={(id) => {
                      unsubscribeMutation.mutate({ id });
                      if (selectedFeedId === id) setSelectedFeedId(null);
                    }}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Items panel */}
          <main className="flex-1 min-w-0 flex flex-col min-h-0">
            {/* Panel header: title + time range tabs */}
            <div className="flex items-center justify-between mb-3 gap-4 flex-shrink-0">
              <h2 className="text-sm font-medium text-secondary_text truncate">
                {selectedFeedTitle}
                {!itemsQuery.isLoading && (
                  <span className="ml-2 text-secondary_text/50">
                    ({visibleItems.length})
                  </span>
                )}
              </h2>

              <div className="flex items-center gap-0.5 bg-theme_secondary_black/50 rounded-lg p-0.5 flex-shrink-0">
                {TIME_RANGES.map((r) => (
                  <button
                    key={r.days}
                    onClick={() => setSinceDays(r.days)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-all duration-150 ${
                      sinceDays === r.days
                        ? "bg-theme_secondary_black text-white font-medium"
                        : "text-secondary_text hover:text-white"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed items */}
            <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin-primary pb-3">
              {itemsQuery.isLoading &&
                [1, 2, 3, 4].map((i) => <NotificationListItemSkeleton key={i} />)}

              {!itemsQuery.isLoading && visibleItems.length === 0 && (
                <p className="text-sm text-secondary_text mt-6 text-center">
                  No items in this time range.
                </p>
              )}

              {visibleItems.map((item, idx) => (
                <div
                  key={item.item_hash ?? idx}
                  className={`transition-opacity duration-200 ${
                    item.item_hash && readHashes.has(item.item_hash)
                      ? "opacity-40"
                      : ""
                  }`}
                  onClick={() => {
                    if (item.link) window.open(item.link, "_blank");
                    if (item.item_hash && !readHashes.has(item.item_hash)) {
                      setLocalReadHashes((prev) => {
                        const next = new Set(prev);
                        next.add(item.item_hash!);
                        return next;
                      });
                      markReadMutation.mutate({ item_hashes: [item.item_hash] });
                    }
                  }}
                >
                  <NotificationListItem data={item} />
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      <OpmlImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </CollectionWrapper>
  );
};

export default Feeds;
