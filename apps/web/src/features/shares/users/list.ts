import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type InviteeInfo = {
  share_id: string;
  email: string;
  name: string | null;
  profile_url: string | null;
  share_type: string;
};

export const getInviteesQueryKey = (collection_id: string) => ["share", "users", collection_id];

export const getCollectionInvitees = (collection_id: string): Promise<IActionResponse<InviteeInfo[]>> => {
  return action.get(`/share/users/collection/${collection_id}`);
};

export const getInviteesQueryOptions = (collection_id: string) =>
  queryOptions({
    queryKey: getInviteesQueryKey(collection_id),
    queryFn: () => getCollectionInvitees(collection_id),
    staleTime: 5 * 60 * 1000,
  });

export const useCollectionInvitees = (collection_id: string) => {
  return useQuery(getInviteesQueryOptions(collection_id));
};
