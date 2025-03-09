import action from "@config/action";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { User } from "@onelink/entities/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getUser = (): Promise<IActionResponse<User>> => {
  return action.get("/auth/me");
};

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
  });
};

type UseUserQueryOptions = {
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export const useUser = (
  enabled: boolean,
  { queryConfig }: UseUserQueryOptions = {},
) => {
  return useQuery({
    ...getUserQueryOptions(),
    ...queryConfig,
    enabled,
  });
};
