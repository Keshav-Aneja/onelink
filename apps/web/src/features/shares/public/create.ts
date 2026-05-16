import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { PublicShare } from "@onelink/entities/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublicShareQueryKey } from "./get";

type CreatePublicShareInput = {
  collection_id: string;
  share_type: "SHALLOW" | "DEEP";
};

export const createPublicShare = (data: CreatePublicShareInput): Promise<IActionResponse<PublicShare>> => {
  return action.post("/share/public", data);
};

export const useCreatePublicShare = (collection_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPublicShare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPublicShareQueryKey(collection_id) });
    },
  });
};
