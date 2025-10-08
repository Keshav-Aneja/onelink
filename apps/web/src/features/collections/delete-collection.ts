import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { deleteCollection } from "@store/slices/collections-slice";
import { useAppDispatch } from "@store/store";
import { useMutation } from "@tanstack/react-query";

export const deleteCollectionMutation = ({
  id,
}: {
  id: string;
}): Promise<IActionResponse<{ id: string }>> => {
  return action.delete(`/collection/${id}`);
};

type UseDeleteCollectionOptions = {
  mutationConfig?: MutationConfig<typeof deleteCollectionMutation>;
};

export const useDeleteCollection = ({
  mutationConfig,
}: UseDeleteCollectionOptions) => {
  const dispatch = useAppDispatch();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      dispatch(deleteCollection(args[0].data.id));
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCollectionMutation,
    mutationKey: ["collection:delete"],
  });
};
