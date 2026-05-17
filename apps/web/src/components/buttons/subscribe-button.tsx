import { cn } from "@lib/tailwind-utils";
import Button from "./button";
import { useUpdateLink } from "@features/links/update-link";
import { useEffect, useState } from "react";
import { RiRssLine, RiRssFill } from "react-icons/ri";

interface Props {
  subscribed: boolean;
  id: string;
  subtle?: boolean;
}

const SubscribeButton = ({ subscribed, id, subtle }: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(subscribed);
  const [update, setUpdate] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSubscribed(!isSubscribed);
    setUpdate(true);
  };

  const updateLinkMutation = useUpdateLink({
    mutationConfig: {
      onSuccess: () => {},
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (update) {
        updateLinkMutation.mutate({ id, data: { subscribed: isSubscribed } });
        setUpdate(false);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isSubscribed, update]);

  if (subtle) {
    return (
      <button
        className={cn(
          "text-sm cursor-pointer transition-colors",
          isSubscribed
            ? "text-primary"
            : "text-theme_secondary_white/40 hover:text-theme_secondary_white",
        )}
        onClick={handleToggle}
        title={isSubscribed ? "Unsubscribe" : "Subscribe"}
      >
        {isSubscribed ? <RiRssFill /> : <RiRssLine />}
      </button>
    );
  }

  return (
    <div className="grow flex justify-end">
      <Button
        className={cn(
          "text-sm font-sans font-bold px-3 py-1",
          isSubscribed && "bg-primary",
        )}
        onClick={handleToggle}
      >
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </div>
  );
};

export default SubscribeButton;
