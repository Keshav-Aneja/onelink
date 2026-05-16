import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import type { RssSubscription } from "@onelink/entities/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscriptionsQueryOptions } from "./get-subscriptions";

export const subscribeFeed = ({ url, link_id }: { url: string; link_id?: string }): Promise<IActionResponse<RssSubscription>> =>
  action.post("/feeds", { url, link_id });

type UseSubscribeFeedOptions = {
  mutationConfig?: MutationConfig<typeof subscribeFeed>;
};

export const useSubscribeFeed = ({ mutationConfig }: UseSubscribeFeedOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getSubscriptionsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: subscribeFeed,
    mutationKey: ["feed:subscribe"],
  });
};
