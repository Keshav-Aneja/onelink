import action from "@config/action";
import { IActionResponse } from "@onelink/action";
import { Link, LinkUpdate } from "@onelink/entities/models";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@store/store";
import { deleteLink, replaceLink } from "@store/slices/links-slice";
import { deleteFavLink, addOrReplaceFavLink } from "@store/slices/favourite-links-slice";
import { MutationConfig } from "@lib/react-query";

export const bulkDeleteLinksMutation = ({
  ids,
}: {
  ids: string[];
}): Promise<IActionResponse<{ ids: string[] }>> => {
  return action.post("/links/bulk-delete", { ids });
};

export const bulkUpdateLinksMutation = ({
  ids,
  data,
}: {
  ids: string[];
  data: Partial<LinkUpdate>;
}): Promise<IActionResponse<Link[]>> => {
  return action.patch("/links/bulk", { ids, data });
};

type UseBulkDeleteOptions = {
  mutationConfig?: MutationConfig<typeof bulkDeleteLinksMutation>;
};

export const useBulkDeleteLinks = ({ mutationConfig }: UseBulkDeleteOptions = {}) => {
  const dispatch = useAppDispatch();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      args[0].data.ids.forEach((id) => {
        dispatch(deleteLink(id));
        dispatch(deleteFavLink(id));
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: bulkDeleteLinksMutation,
    mutationKey: ["links:bulk-delete"],
  });
};

type UseBulkUpdateOptions = {
  mutationConfig?: MutationConfig<typeof bulkUpdateLinksMutation>;
};

export const useBulkUpdateLinks = ({ mutationConfig }: UseBulkUpdateOptions = {}) => {
  const dispatch = useAppDispatch();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      args[0].data.forEach((link) => {
        dispatch(replaceLink(link));
        if (link.is_starred) {
          dispatch(addOrReplaceFavLink(link));
        } else {
          dispatch(deleteFavLink(link.id));
        }
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: bulkUpdateLinksMutation,
    mutationKey: ["links:bulk-update"],
  });
};
