import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getInviteesQueryKey } from "./list";

type RemoveInviteInput = {
  share_id: string;
  collection_id: string;
};

export const removeInvite = ({ share_id }: RemoveInviteInput): Promise<IActionResponse<{ id: string }>> => {
  return action.delete(`/share/users/${share_id}`);
};

export const useRemoveInvite = (collection_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getInviteesQueryKey(collection_id) });
    },
  });
};
