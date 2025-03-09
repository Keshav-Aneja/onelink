import { CreateCollection } from "@components/cards/create-collection-card";
import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { Collection } from "@onelink/entities/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCollectionsQueryOptions } from "./get-collections";
import { ROOT_PATH } from "@config/constants";
import { useAppDispatch } from "@store/store";
import { addCollection } from "@store/slices/collections-slice";

export const createCollection = (
  data: CreateCollection,
): Promise<IActionResponse<Collection>> => {
  return action.post("/collection", data);
};

type UseCreateCollectionOptions = {
  parentId: string | null;
  mutationConfig?: MutationConfig<typeof createCollection>;
};

export const useCreateCollection = ({
  mutationConfig,
  parentId,
}: UseCreateCollectionOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};
  const dispatch = useAppDispatch();
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getCollectionsQueryOptions(parentId).queryKey,
      });
      dispatch(addCollection(args[0].data));
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationKey: ["collection", parentId ?? ROOT_PATH],
    mutationFn: createCollection,
  });
};
