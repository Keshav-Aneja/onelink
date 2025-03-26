import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { Link, LinkUpdate } from "@onelink/entities/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLinksQueryOptions } from "./get-links";
import { useAppDispatch } from "@store/store";
import { replaceLink } from "@store/slices/links-slice";

export const updateLink = ({
  id,
  data,
}: {
  id: string;
  data: Partial<LinkUpdate>;
}): Promise<IActionResponse<Link>> => {
  console.log("SENT DATA", data);
  return action.patch(`/links/${id}`, data);
};

type UseUpdateLinkOptions = {
  mutationConfig?: MutationConfig<typeof updateLink>;
};

export const useUpdateLink = ({ mutationConfig }: UseUpdateLinkOptions) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getLinksQueryOptions(null).queryKey,
      });
      dispatch(replaceLink(args[0].data));
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateLink,
    mutationKey: ["link:update"],
  });
};
