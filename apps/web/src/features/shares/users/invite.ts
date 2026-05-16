import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { Share } from "@onelink/entities/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getInviteesQueryKey } from "./list";

type InviteUserInput = {
  collection_id: string;
  email: string;
  share_type: "SHALLOW" | "DEEP";
};

export const inviteUser = (data: InviteUserInput): Promise<IActionResponse<Share>> => {
  return action.post("/share/users", data);
};

export const useInviteUser = (collection_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getInviteesQueryKey(collection_id) });
    },
  });
};
