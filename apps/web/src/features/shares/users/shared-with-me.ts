import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type SharedCollectionItem = {
  collection: {
    id: string;
    name: string;
    color: string;
    description: string | null;
  };
  share_id: string;
  share_type: string;
  shared_by_email: string;
};

export const getSharedWithMe = (): Promise<IActionResponse<SharedCollectionItem[]>> => {
  return action.get("/share/users/shared-with-me");
};

export const sharedWithMeQueryOptions = queryOptions({
  queryKey: ["share", "shared-with-me"],
  queryFn: getSharedWithMe,
  staleTime: 5 * 60 * 1000,
});

export const useSharedWithMe = () => {
  return useQuery(sharedWithMeQueryOptions);
};
