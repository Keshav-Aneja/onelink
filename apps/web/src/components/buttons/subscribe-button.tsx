import { cn } from "@lib/tailwind-utils";
import Button from "./button";
import { useUpdateLink } from "@features/links/update-link";
import { useState } from "react";

interface Props {
  subscribed: boolean;
  id: string;
}

const SubscribeButton = ({ subscribed, id }: Props) => {
  const [subscribe, setSubscribe] = useState(subscribed);
  const subscribeMutation = useUpdateLink({
    mutationConfig: {
      onSuccess: () => {
        setSubscribe(!subscribe);
      },
    },
  });

  const handleSubscribeChange = () => {
    subscribeMutation.mutate({
      id,
      data: {
        subscribed: !subscribe,
      },
    });
  };

  return (
    <div className="flex-grow flex justify-end">
      <Button
        className={cn(
          " text-sm font-sans font-bold px-3 py-1 ",
          subscribe && "bg-primary",
        )}
        disabled={subscribeMutation.isPending}
        aria-disabled={subscribeMutation.isPending}
        onClick={handleSubscribeChange}
      >
        {subscribe ? "Subscribed" : "Subscribe"}
      </Button>
    </div>
  );
};

export default SubscribeButton;
