import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { deleteLink } from "@store/slices/links-slice";
import { useAppDispatch } from "@store/store";
import { useMutation } from "@tanstack/react-query";

export const deleteLinkMutation = ({
  id,
}: {
  id: string;
}): Promise<IActionResponse<{ id: string }>> => {
  return action.delete(`/links/${id}`);
};

type UseDeleteLinkOptions = {
  mutationConfig?: MutationConfig<typeof deleteLinkMutation>;
};

export const useDeleteLink = ({ mutationConfig }: UseDeleteLinkOptions) => {
  const dispatch = useAppDispatch();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      dispatch(deleteLink(args[0].data.id));
      //Consider if you want to invalidate the queries or not here
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteLinkMutation,
    mutationKey: ["link:delete"],
  });
};
