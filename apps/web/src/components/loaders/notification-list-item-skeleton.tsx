import Button from "@components/buttons/button";

const NotificationListItemSkeleton = () => {
  return (
    <div className="w-full px-4 py-4 rounded-md border-theme_secondary_white/50 border-1 hover:bg-theme_secondary_black cursor-pointer flex items-center justify-between">
      <span className="w-full">
        <h2 className="text-base font-medium truncate w-1/2 h-7 mb-1 animate-pulse bg-theme_secondary_black"></h2>
        <p className="text-theme_secondary_white text-sm w-1/5 h-3 bg-theme_secondary_black animate-pulse "></p>
      </span>
      <Button disabled className="animate-pulse bg-theme_secondary_black w-36">
        &nbsp;
      </Button>
    </div>
  );
};

export default NotificationListItemSkeleton;
