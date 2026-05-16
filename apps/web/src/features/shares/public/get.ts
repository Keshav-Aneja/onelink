import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { PublicShare } from "@onelink/entities/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getPublicShareQueryKey = (collection_id: string) => ["share", "public", collection_id];

export const getPublicShare = (collection_id: string): Promise<IActionResponse<PublicShare | null>> => {
  return action.get(`/share/public/collection/${collection_id}`);
};

export const getPublicShareQueryOptions = (collection_id: string) =>
  queryOptions({
    queryKey: getPublicShareQueryKey(collection_id),
    queryFn: () => getPublicShare(collection_id),
    staleTime: 5 * 60 * 1000,
  });

export const usePublicShareForCollection = (collection_id: string) => {
  return useQuery(getPublicShareQueryOptions(collection_id));
};
