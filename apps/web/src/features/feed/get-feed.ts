import action from "@config/action";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { RSSFeed } from "@onelink/scraper/rss";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getFeed = (
  sinceDays: number,
): Promise<IActionResponse<RSSFeed[] | null>> => {
  return action.post("/links/feed", {
    sinceDays,
  });
};

export const getFeedQueryOptions = (sinceDays: number) => {
  return queryOptions({
    queryKey: ["feed"],
    queryFn: () => {
      return getFeed(sinceDays);
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

type UseFeedQueryOptions = {
  queryConfig?: QueryConfig<typeof getFeedQueryOptions>;
};

export const useFeed = (
  sinceDays: number,
  { queryConfig }: UseFeedQueryOptions = {},
) => {
  return useQuery({
    ...getFeedQueryOptions(sinceDays),
    ...queryConfig,
  });
};
