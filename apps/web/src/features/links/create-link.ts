import { CreateLink } from "@components/cards/create-link-card";
import action from "@config/action";
import { ROOT_PATH } from "@config/constants";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { Link } from "@onelink/entities/models";
import { useAppDispatch } from "@store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLinksQueryOptions } from "./get-links";
import { addLink } from "@store/slices/links-slice";

export const createLink = (
  data: CreateLink,
): Promise<IActionResponse<Link>> => {
  return action.post("/links", data);
};

type UseCreateLinkOptions = {
  parentId: string | null;
  mutationConfig?: MutationConfig<typeof createLink>;
};

export const useCreateLink = ({
  mutationConfig,
  parentId,
}: UseCreateLinkOptions) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      //Invalidate the collections get query
      queryClient.invalidateQueries({
        queryKey: getLinksQueryOptions(parentId, false).queryKey,
      });
      //dispatch to the link collection
      dispatch(addLink(args[0].data));
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createLink,
    mutationKey: ["link", parentId ?? ROOT_PATH],
  });
};
