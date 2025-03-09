import CircularButton from "@components/buttons/circular-button";
import { RiNotification4Fill } from "react-icons/ri";
import Popover from "./popover";
import { cn } from "@lib/tailwind-utils";
import Button from "@components/buttons/button";

const NotificationBox = () => {
  return (
    <section className="relative">
      <Popover
        key={1}
        Trigger={<NotificationTrigger />}
        Content={({ className }) => (
          <NotificaitonContent className={className} />
        )}
      />
    </section>
  );
};

export default NotificationBox;

type ContentProps = {
  className?: string;
};
export function NotificaitonContent({ className }: ContentProps) {
  return (
    <div className={cn(className, "w-88 xxl:w-100 p-3 xxl:p-4 z-[100]")}>
      <span className="w-full text-left text-lg xxl:text-xl  tracking-wide truncate font-semibold border-b-1 border-b-white/40 pb-2">
        Notifiations
      </span>
      <div className="flex flex-col">
        <NotificationItem />
        <NotificationItem />
      </div>
    </div>
  );
}

export function NotificationTrigger() {
  return (
    <CircularButton>
      {/* TODO: Render the notifications blob based on the availability */}
      <span className=" bg-primary w-5 h-5 rounded-full flex items-center justify-center absolute -top-1 -right-1 text-xs font-bold">
        9+
      </span>
      <RiNotification4Fill className="text-xl xxl:text-2xl" />
    </CircularButton>
  );
}

export function NotificationItem() {
  return (
    <div className="w-full flex flex-col gap-2 not-first:border-t-1 border-white/20 not-first:-mt-4 pt-2 xxl:pt-4 last:-mb-4">
      <section className="relative">
        <h3 className="text-sm xxl:text-base font-medium">New Blog</h3>
        <p className="text-xs xxl:text-sm text-secondary_text h-16 w-full text-wrap truncate">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi,
          beatae? Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Eaque, accusantium? Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Perspiciatis, numquam.Lorem ipsum dolor, sit amet
          consectetur adipisicing elit. Animi, beatae? Lorem ipsum dolor, sit
          amet consectetur adipisicing elit. Eaque, accusantium? Lorem ipsum
          dolor sit amet, consectetur adipisicing elit. Perspiciatis, numquam.
        </p>
        <div className="absolute bottom-0 left-0 h-1/3 bg-linear-0 from-black to-transparent w-full"></div>
      </section>
      <aside className="self-end relative bottom-8">
        <Button className="text-xs xxl:text-sm hover:bg-primary">
          Read more
        </Button>
      </aside>
    </div>
  );
}
