import action from "@config/action";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getReadHashes = (): Promise<IActionResponse<string[]>> =>
  action.get("/feeds/read-hashes");

export const getReadHashesQueryOptions = () =>
  queryOptions({
    queryKey: ["feed-read-hashes"],
    queryFn: getReadHashes,
    staleTime: 5 * 60 * 1000,
  });

type UseReadHashesOptions = {
  queryConfig?: QueryConfig<typeof getReadHashesQueryOptions>;
};

export const useReadHashes = ({ queryConfig }: UseReadHashesOptions = {}) =>
  useQuery({ ...getReadHashesQueryOptions(), ...queryConfig });
