import action from "@config/action";
import { ROOT_PATH } from "@config/constants";
import { QueryConfig } from "@lib/react-query";
import { getParentPath } from "@lib/utils/get-paths";
import { IActionResponse } from "@onelink/action";
import { Collection } from "@onelink/entities/models";
import { queryOptions, useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation } from "react-router";

export const getCollections = (
  parent_id: string | null,
): Promise<IActionResponse<Collection[]>> => {
  return action.get(`/collection${parent_id ? `/${parent_id}` : ""}`);
};

export const getCollectionsQueryOptions = (parent_id: string | null) => {
  return queryOptions({
    queryKey: ["collections", parent_id ?? ROOT_PATH],
    queryFn: () => {
      return getCollections(parent_id);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

type UseCollectionsQueryOptions = {
  queryConfig?: QueryConfig<typeof getCollectionsQueryOptions>;
};

export const useCollections = (
  enabled: boolean,
  pathId: string | null | undefined,
  { queryConfig }: UseCollectionsQueryOptions = {},
) => {
  const parentPath = pathId !== undefined ? pathId : null;
  console.log("ENABLED", enabled);
  console.log("FETCH TIME PARENT ID", parentPath);
  console.log("WILL FETCH", pathId !== undefined && enabled);
  return useQuery({
    ...getCollectionsQueryOptions(parentPath),
    ...queryConfig,
    enabled: pathId !== undefined && enabled,
  });
};
