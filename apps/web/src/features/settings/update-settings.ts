import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import type { UserSettings, UserSettingsUpdate } from "@onelink/entities/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettingsQueryOptions } from "./get-settings";

export const updateSettings = (data: UserSettingsUpdate): Promise<IActionResponse<UserSettings>> =>
  action.patch("/settings", data);

type UseUpdateSettingsOptions = {
  mutationConfig?: MutationConfig<typeof updateSettings>;
};

export const useUpdateSettings = ({ mutationConfig }: UseUpdateSettingsOptions = {}) => {
  const queryClient = useQueryClient();
  const queryKey = getSettingsQueryOptions().queryKey;
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateSettings,
    mutationKey: ["settings:update"],
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<IActionResponse<UserSettings>>(queryKey);
      queryClient.setQueryData<IActionResponse<UserSettings>>(queryKey, (old) => {
        if (!old?.data) return old;
        return { ...old, data: { ...old.data, ...variables } };
      });
      return { previous };
    },
    onError: (err, vars, context: any) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      (onError as ((e: Error, v: UserSettingsUpdate, c: any) => void) | undefined)?.(err, vars, context);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
