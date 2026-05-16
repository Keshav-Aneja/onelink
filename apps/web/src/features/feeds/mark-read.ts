import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { useMutation } from "@tanstack/react-query";

export const markFeedItemsRead = ({ item_hashes }: { item_hashes: string[] }): Promise<IActionResponse<null>> =>
  action.post("/feeds/read", { item_hashes });

export const markAllFeedsRead = ({ sinceDays }: { sinceDays?: number } = {}): Promise<IActionResponse<null>> =>
  action.post("/feeds/read-all", { sinceDays });

type UseMarkReadOptions = {
  mutationConfig?: MutationConfig<typeof markFeedItemsRead>;
};

export const useMarkFeedRead = ({ mutationConfig }: UseMarkReadOptions = {}) =>
  useMutation({
    ...mutationConfig,
    mutationFn: markFeedItemsRead,
    mutationKey: ["feed:mark-read"],
  });

type UseMarkAllReadOptions = {
  mutationConfig?: MutationConfig<typeof markAllFeedsRead>;
};

export const useMarkAllFeedsRead = ({ mutationConfig }: UseMarkAllReadOptions = {}) =>
  useMutation({
    ...mutationConfig,
    mutationFn: markAllFeedsRead,
    mutationKey: ["feed:mark-all-read"],
  });
