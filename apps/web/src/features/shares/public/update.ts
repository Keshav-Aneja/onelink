import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { PublicShare } from "@onelink/entities/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublicShareQueryKey } from "./get";

type UpdatePublicShareInput = {
  id: string;
  collection_id: string;
  share_type?: "SHALLOW" | "DEEP";
  is_active?: boolean;
};

export const updatePublicShare = ({ id, collection_id: _cid, ...data }: UpdatePublicShareInput): Promise<IActionResponse<PublicShare>> => {
  return action.patch(`/share/public/${id}`, data);
};

export const useUpdatePublicShare = (collection_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePublicShare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPublicShareQueryKey(collection_id) });
    },
  });
};
