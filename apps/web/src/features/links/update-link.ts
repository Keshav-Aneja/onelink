import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { Link, LinkUpdate } from "@onelink/entities/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLinksQueryOptions } from "./get-links";
import { useAppDispatch } from "@store/store";
import { replaceLink } from "@store/slices/links-slice";
import {
  addFavLink,
  addOrReplaceFavLink,
  deleteFavLink,
} from "@store/slices/favourite-links-slice";

export const updateLink = ({
  id,
  data,
}: {
  id: string;
  data: Partial<LinkUpdate>;
}): Promise<IActionResponse<Link>> => {
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
        queryKey: getLinksQueryOptions(null, false).queryKey,
      });
      dispatch(replaceLink(args[0].data));
      if (args[0].data.is_starred) {
        dispatch(addOrReplaceFavLink(args[0].data));
      } else {
        dispatch(deleteFavLink(args[0].data.id));
      }
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateLink,
    mutationKey: ["link:update"],
  });
};
