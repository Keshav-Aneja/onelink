import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { useMutation } from "@tanstack/react-query";
import { MutationConfig } from "@lib/react-query";

interface BulkTagResult {
  link_ids: string[];
  added: string[];
  removed: string[];
}

export const bulkApplyTagsMutation = ({
  link_ids,
  add,
  remove,
}: {
  link_ids: string[];
  add: string[];
  remove: string[];
}): Promise<IActionResponse<BulkTagResult>> => {
  return action.post("/tags/bulk", { link_ids, add, remove });
};

type UseBulkApplyTagsOptions = {
  mutationConfig?: MutationConfig<typeof bulkApplyTagsMutation>;
};

export const useBulkApplyTags = ({ mutationConfig }: UseBulkApplyTagsOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: bulkApplyTagsMutation,
    mutationKey: ["tags:bulk-apply"],
  });
};
