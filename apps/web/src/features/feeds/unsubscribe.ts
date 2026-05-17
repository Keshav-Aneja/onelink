import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscriptionsQueryOptions } from "./get-subscriptions";

export const unsubscribeFeed = ({ id }: { id: string }): Promise<IActionResponse<{ id: string }>> =>
  action.delete(`/feeds/${id}`);

type UseUnsubscribeFeedOptions = {
  mutationConfig?: MutationConfig<typeof unsubscribeFeed>;
};

export const useUnsubscribeFeed = ({ mutationConfig }: UseUnsubscribeFeedOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getSubscriptionsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: unsubscribeFeed,
    mutationKey: ["feed:unsubscribe"],
  });
};

export const pruneInactiveFeeds = (): Promise<IActionResponse<{ removed: number }>> =>
  action.delete("/feeds/inactive");

type UsePruneInactiveFeedsOptions = {
  mutationConfig?: MutationConfig<typeof pruneInactiveFeeds>;
};

export const usePruneInactiveFeeds = ({ mutationConfig }: UsePruneInactiveFeedsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getSubscriptionsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: pruneInactiveFeeds,
    mutationKey: ["feed:prune-inactive"],
  });
};
