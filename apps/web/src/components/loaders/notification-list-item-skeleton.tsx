const NotificationListItemSkeleton = () => {
  return (
    <div className="w-full px-4 py-3.5 rounded-lg flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="h-4 w-3/5 rounded bg-theme_secondary_black animate-pulse mb-2" />
        <div className="h-3 w-1/4 rounded bg-theme_secondary_black/60 animate-pulse" />
      </div>
      <div className="h-7 w-16 rounded-md bg-theme_secondary_black animate-pulse flex-shrink-0" />
    </div>
  );
};

export default NotificationListItemSkeleton;
