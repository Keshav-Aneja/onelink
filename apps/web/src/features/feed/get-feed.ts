import action from "@config/action";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import type { RSSFeed } from "@onelink/entities/models";

import { queryOptions, useQuery } from "@tanstack/react-query";

type FeedParams = {
  sinceDays?: number;
  startDate?: string;
  endDate?: string;
};

export const getFeed = (
  params: FeedParams,
): Promise<IActionResponse<RSSFeed[] | null>> => {
  return action.post("/links/feed", params);
};

export const getFeedQueryOptions = (params: FeedParams) => {
  return queryOptions({
    queryKey: ["feed", params],
    queryFn: () => {
      return getFeed(params);
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

type UseFeedQueryOptions = {
  queryConfig?: QueryConfig<typeof getFeedQueryOptions>;
};

export const useFeed = (
  params: FeedParams,
  { queryConfig }: UseFeedQueryOptions = {},
) => {
  return useQuery({
    ...getFeedQueryOptions(params),
    ...queryConfig,
  });
};
