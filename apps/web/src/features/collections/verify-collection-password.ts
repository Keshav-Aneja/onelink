import action from "@config/action";
import { MutationConfig } from "@lib/react-query";
import { IActionResponse } from "@onelink/action";
import { addToSecuredCollection } from "@store/slices/application-slice";
import { useAppDispatch } from "@store/store";
import { useMutation } from "@tanstack/react-query";

export const verifyColection = (
  password: string,
  id: string,
): Promise<IActionResponse<{ verified: boolean }>> => {
  return action.post(`/collection/verify${id ? `/${id}` : ""}`, { password });
};

type UseVerifyCollectionOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof verifyColection>;
};

export const useVerifyCollection = ({
  id,
  mutationConfig,
}: UseVerifyCollectionOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  const dispatch = useAppDispatch();
  return useMutation({
    onSuccess: (...args) => {
      dispatch(addToSecuredCollection(id));
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationKey: ["verify", id],
    mutationFn: (password: string) => {
      return verifyColection(password, id);
    },
  });
};
