import action from "@config/action";
import { QueryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import type { UserSettings } from "@onelink/entities/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getSettings = (): Promise<IActionResponse<UserSettings>> =>
  action.get("/settings");

export const getSettingsQueryOptions = () =>
  queryOptions({
    queryKey: ["user-settings"],
    queryFn: getSettings,
    staleTime: Infinity,
  });

type UseSettingsOptions = {
  queryConfig?: QueryConfig<typeof getSettingsQueryOptions>;
};

export const useSettings = ({ queryConfig }: UseSettingsOptions = {}) =>
  useQuery({ ...getSettingsQueryOptions(), ...queryConfig });
