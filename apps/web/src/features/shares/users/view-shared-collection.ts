import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { PublicCollectionView } from "@features/shares/public/get-public-collection";

export const getSharedCollection = (collection_id: string): Promise<IActionResponse<PublicCollectionView>> => {
  return action.get(`/share/users/view/${collection_id}`);
};

export const getSharedCollectionQueryOptions = (collection_id: string) =>
  queryOptions({
    queryKey: ["share", "view", collection_id],
    queryFn: () => getSharedCollection(collection_id),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

export const useSharedCollection = (collection_id: string) => {
  return useQuery(getSharedCollectionQueryOptions(collection_id));
};
