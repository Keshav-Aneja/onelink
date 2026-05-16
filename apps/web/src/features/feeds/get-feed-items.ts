import action from "@config/action";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import type { RSSFeed } from "@onelink/entities/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

type FeedItemsParams = {
  sinceDays?: number;
  startDate?: string;
  endDate?: string;
  feedId?: string;
};

export const getFeedItems = (params: FeedItemsParams): Promise<IActionResponse<RSSFeed[]>> =>
  action.post("/feeds/items", params);

export const getFeedItemsQueryOptions = (params: FeedItemsParams) =>
  queryOptions({
    queryKey: ["feed-items", params],
    queryFn: () => getFeedItems(params),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

type UseFeedItemsOptions = {
  queryConfig?: QueryConfig<typeof getFeedItemsQueryOptions>;
};

type NotificationParams = {
  sinceDays?: number;
  feedId?: string;
};

export const getNotifications = (params: NotificationParams): Promise<IActionResponse<RSSFeed[]>> =>
  action.post("/feeds/notifications", params);

export const getNotificationsQueryOptions = (params: NotificationParams) =>
  queryOptions({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

type UseNotificationsOptions = {
  queryConfig?: QueryConfig<typeof getNotificationsQueryOptions>;
};

export const useFeedItems = (params: FeedItemsParams, { queryConfig }: UseFeedItemsOptions = {}) =>
  useQuery({ ...getFeedItemsQueryOptions(params), ...queryConfig });

export const useNotifications = (params: NotificationParams = {}, { queryConfig }: UseNotificationsOptions = {}) =>
  useQuery({ ...getNotificationsQueryOptions(params), ...queryConfig });
