import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { queryOptions, useQuery } from "@tanstack/react-query";

type SafeCollection = {
  id: string;
  name: string;
  color: string;
  description: string | null;
};

type CollectionNode = {
  collection: SafeCollection;
  links: any[];
  children: CollectionNode[];
};

export type PublicCollectionView = {
  share_type: "SHALLOW" | "DEEP";
  collection: SafeCollection;
  links: any[];
  children: CollectionNode[];
  shared_by_email: string;
};

export const getPublicCollection = (token: string): Promise<IActionResponse<PublicCollectionView>> => {
  return action.get(`/public/${token}`);
};

export const getPublicCollectionQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ["public-collection", token],
    queryFn: () => getPublicCollection(token),
    retry: false,
    staleTime: 60_000,
  });

export const usePublicCollection = (token: string) => {
  return useQuery(getPublicCollectionQueryOptions(token));
};
