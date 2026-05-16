import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublicShareQueryKey } from "./get";

type DeletePublicShareInput = {
  id: string;
  collection_id: string;
};

export const deletePublicShare = ({ id }: DeletePublicShareInput): Promise<IActionResponse<{ id: string }>> => {
  return action.delete(`/share/public/${id}`);
};

export const useDeletePublicShare = (collection_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePublicShare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPublicShareQueryKey(collection_id) });
    },
  });
};
