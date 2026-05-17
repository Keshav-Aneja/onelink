import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const markFeedItemsRead = ({ item_hashes }: { item_hashes: string[] }): Promise<IActionResponse<null>> =>
  action.post("/feeds/read", { item_hashes });

export const markAllFeedsRead = ({ sinceDays }: { sinceDays?: number } = {}): Promise<IActionResponse<null>> =>
  action.post("/feeds/read-all", { sinceDays });

type UseMarkReadOptions = {
  mutationConfig?: MutationConfig<typeof markFeedItemsRead>;
};

export const useMarkFeedRead = ({ mutationConfig }: UseMarkReadOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationConfig,
    mutationFn: markFeedItemsRead,
    mutationKey: ["feed:mark-read"],
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["feed-read-hashes"] });
      mutationConfig?.onSuccess?.(...args);
    },
  });
};

type UseMarkAllReadOptions = {
  mutationConfig?: MutationConfig<typeof markAllFeedsRead>;
};

export const useMarkAllFeedsRead = ({ mutationConfig }: UseMarkAllReadOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationConfig,
    mutationFn: markAllFeedsRead,
    mutationKey: ["feed:mark-all-read"],
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["feed-read-hashes"] });
      mutationConfig?.onSuccess?.(...args);
    },
  });
};
