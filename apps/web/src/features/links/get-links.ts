import action from "@config/action";
import { ROOT_PATH } from "@config/constants";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { Link } from "@onelink/entities/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getLinks = (
  parent_id: string | null,
): Promise<IActionResponse<Link[]>> => {
  return action.get(`/links${parent_id ? `/${parent_id}` : ""}`);
};

export const getLinksQueryOptions = (parent_id: string | null) => {
  return queryOptions({
    queryKey: ["links", parent_id ?? ROOT_PATH],
    queryFn: () => {
      return getLinks(parent_id);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

type UseLinksQueryOptions = {
  queryConfig?: QueryConfig<typeof getLinksQueryOptions>;
};

export const useLinks = (
  enabled: boolean,
  pathId: string | null | undefined,
  { queryConfig }: UseLinksQueryOptions = {},
) => {
  const parentPath = pathId !== undefined ? pathId : null;
  console.log("ENABLED", enabled);
  console.log("FETCH TIME PARENT ID", parentPath);
  console.log("WILL FETCH", pathId !== undefined && enabled);
  return useQuery({
    ...getLinksQueryOptions(parentPath),
    ...queryConfig,
    enabled: pathId !== undefined && enabled,
  });
};
