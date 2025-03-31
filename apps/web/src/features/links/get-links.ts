import action from "@config/action";
import { ROOT_PATH } from "@config/constants";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { Link } from "@onelink/entities/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getLinks = (
  parent_id: string | null,
  favourite?: boolean,
): Promise<IActionResponse<Link[]>> => {
  return action.get(
    `/links${parent_id ? `/${parent_id}` : ""}${favourite === true ? `?starred=true` : ""}`,
  );
};

export const getLinksQueryOptions = (
  parent_id: string | null,
  favourite: boolean,
) => {
  return queryOptions({
    queryKey: [
      favourite === true ? "favourite" : "links",
      parent_id ?? ROOT_PATH,
    ],
    queryFn: () => {
      return getLinks(parent_id, favourite);
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
  favourite?: boolean,
  { queryConfig }: UseLinksQueryOptions = {},
) => {
  const parentPath = pathId !== undefined ? pathId : null;
  return useQuery({
    ...getLinksQueryOptions(parentPath, favourite ?? false),
    ...queryConfig,
    enabled: pathId !== undefined && enabled,
  });
};
