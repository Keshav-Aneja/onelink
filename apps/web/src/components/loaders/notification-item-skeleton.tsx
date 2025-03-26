import Button from "@components/buttons/button";

const NotificationItemSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-2 not-first:border-t-1 border-white/20 not-first:-mt-4 pt-2 xxl:pt-4 last:-mb-4">
      <section className="relative">
        <h3 className="text-sm xxl:text-base font-medium h-5 bg-theme_secondary_black animate-pulse rounded-md mb-1"></h3>
        <p className="text-xs xxl:text-sm text-secondary_text h-8 w-full text-wrap truncate pt-1 bg-theme_secondary_black rounded-md "></p>
        <div className="absolute bottom-0 left-0 h-1/3 bg-linear-0 from-black to-transparent w-full"></div>
      </section>
      <aside className="self-end relative bottom-8">
        <Button className="text-xs xxl:text-sm hover:bg-primary animate-pulse bg-theme_secondary_black">
          <span className="opacity-0">Read more</span>
        </Button>
      </aside>
    </div>
  );
};

export default NotificationItemSkeleton;
