import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscriptionsQueryOptions } from "./get-subscriptions";

export const importOpml = ({ opml }: { opml: string }): Promise<IActionResponse<{ added: number }>> =>
  action.post("/feeds/opml", { opml });

export const exportOpml = (): Promise<Blob> => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  return fetch(`${backendUrl}/api/feeds/opml`, { credentials: "include" }).then((r) => r.blob());
};

type UseImportOpmlOptions = {
  mutationConfig?: MutationConfig<typeof importOpml>;
};

export const useImportOpml = ({ mutationConfig }: UseImportOpmlOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getSubscriptionsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: importOpml,
    mutationKey: ["feed:import-opml"],
  });
};
