import action from "@config/action";
import { queryConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

interface LogoutResponse {
  redirect: boolean;
  success: boolean;
}

export const logoutUser = (): Promise<IActionResponse<LogoutResponse>> => {
  return action.post("/auth/logout");
};

export const getLogoutUserQueryOptions = () => {
  return queryOptions({
    queryKey: ["logout"],
    queryFn: logoutUser,
    gcTime: 0,
  });
};

export const useLogoutUser = () => {
  return useQuery({
    ...getLogoutUserQueryOptions(),
    ...queryConfig,
  });
};

export const useLogoutUserMutation = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};
