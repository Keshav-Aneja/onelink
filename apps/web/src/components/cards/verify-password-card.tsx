import { cn } from "@lib/tailwind-utils";
import { Fragment } from "react/jsx-runtime";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@components/form/Input";
import Button from "@components/buttons/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { getParentIdFromPath } from "@lib/utils/get-paths";
import { ImSpinner2 } from "react-icons/im";
import { CiUnlock } from "react-icons/ci";
import { useVerifyCollection } from "@features/collections/verify-collection-password";
import React from "react";
import { useAppDispatch, useAppSelector } from "@store/store";
import {
  addToSecuredCollection,
  getSecuredCollection,
} from "@store/slices/application-slice";

interface Props {
  setVerificationNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}

const passwordSchema = z.object({
  password: z.string().min(3).max(30),
});
export type Password = z.infer<typeof passwordSchema>;
const VerifyPassordCard = ({ setVerificationNeeded }: Props) => {
  const pathId = getParentIdFromPath();
  const dispatch = useAppDispatch();
  const securedCollections = useAppSelector(getSecuredCollection);
  if (!pathId) {
    return null;
  }
  const verifyMutation = useVerifyCollection({
    id: pathId,
    mutationConfig: {
      onSuccess: (data) => {
        if (data.data.verified) {
          setVerificationNeeded(false);
          if (!securedCollections.includes(pathId)) {
            dispatch(addToSecuredCollection(pathId));
          }
        } else {
          setVerificationNeeded(true);
        }
      },
    },
  });
  //--------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Password>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<Password> = async (data: Password) => {
    verifyMutation.mutate(data.password);
  };

  return (
    <Fragment>
      <div
        className={cn(
          "w-1/3 h-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] p-8 border-1 border-theme_secondary_white/50 rounded-lg",
        )}
      >
        <h1 className="text-2xl xxl:text-3xl border-b-1 border-theme_secondary_white/40 pb-3 mb-4">
          Verify Password
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input<Password>
            label="password"
            required={true}
            register={register}
            placeholder="Enter a strong password"
            focus={true}
            type="password"
            error={errors.password}
          />
          <Button
            type="submit"
            className="w-full rounded-md"
            Icon={CiUnlock}
            iconSize="xl"
            disabled={verifyMutation.isPending}
            aria-disabled={verifyMutation.isPending}
            loading={verifyMutation.isPending}
            Loader={
              <span className="flex items-center justify-center w-full gap-4">
                <ImSpinner2 className="animate-spin" />
                <p>Verifying</p>
              </span>
            }
          >
            Verify Password
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default VerifyPassordCard;
