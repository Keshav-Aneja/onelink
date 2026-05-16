import action from "@config/action";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import type { RssSubscriptionWithUnread } from "@onelink/entities/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getSubscriptions = (): Promise<IActionResponse<RssSubscriptionWithUnread[]>> =>
  action.get("/feeds");

export const getSubscriptionsQueryOptions = () =>
  queryOptions({
    queryKey: ["feeds"],
    queryFn: getSubscriptions,
    staleTime: 5 * 60 * 1000,
  });

type UseSubscriptionsOptions = {
  queryConfig?: QueryConfig<typeof getSubscriptionsQueryOptions>;
};

export const useSubscriptions = ({ queryConfig }: UseSubscriptionsOptions = {}) =>
  useQuery({ ...getSubscriptionsQueryOptions(), ...queryConfig });
