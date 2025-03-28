import action from "@config/action";
import { ROOT_PATH } from "@config/constants";
import { queryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { queryOptions, useQuery } from "@tanstack/react-query";

type CollectionStats = {
  collections: number;
  links: number;
};

export const getCollectionsStats = (
  parent_id: string | null,
): Promise<IActionResponse<CollectionStats>> => {
  return action.get(`/collection/stats${parent_id ? `/${parent_id}` : ""}`);
};

export const getCollectionsStatsQueryOptions = (parent_id: string | null) => {
  return queryOptions({
    queryKey: ["stats", parent_id ?? ROOT_PATH],
    queryFn: () => {
      return getCollectionsStats(parent_id);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCollectionsStats = (
  collection_id: string | null,
  enabled: boolean,
) => {
  return useQuery({
    ...getCollectionsStatsQueryOptions(collection_id),
    ...queryConfig,
    enabled: enabled && collection_id !== null,
  });
};
