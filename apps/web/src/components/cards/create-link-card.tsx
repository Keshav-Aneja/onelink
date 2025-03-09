import { cn } from "@lib/tailwind-utils";
import { Fragment } from "react/jsx-runtime";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@components/form/Input";
import Button from "@components/buttons/button";
import { FaPlus } from "react-icons/fa";
import Textarea from "@components/form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkSchema } from "@onelink/entities/models";
import { getParentIdFromPath } from "@lib/utils/get-paths";
import CloseButton from "@components/buttons/close-button";
import { nanoid } from "@reduxjs/toolkit";
import { useCreateLink } from "@features/links/create-link";
interface CreateLinkCardProps {
  className?: string;
  closeModal?: () => void;
}

const linkSchema = LinkSchema.omit({
  name: true,
  id: true,
  owner_id: true,
  parent_id: true,
  open_graph: true,
  fingerprint: true,
});
export type CreateLink = z.infer<typeof linkSchema>;
const CreateLinkCard = ({ className, closeModal }: CreateLinkCardProps) => {
  const pathId = getParentIdFromPath();
  if (pathId === undefined) {
    return null;
  }
  const createLinkMutation = useCreateLink({
    parentId: pathId,
    mutationConfig: {
      onSuccess: () => {
        console.log("Link added successfull");
        closeModal && closeModal();
      },
    },
  });

  //--------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLink>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      description: "",
      link: "",
    },
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<CreateLink> = (data) => {
    console.log("SUBMITTING");
    const linkData = { ...data, parent_id: pathId, fingerprint: nanoid(10) };
    console.log(linkData);
    createLinkMutation.mutate(linkData);
  };

  return (
    <Fragment>
      <div
        className={cn(
          className,
          "w-1/3 h-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] p-8",
        )}
      >
        <CloseButton close={closeModal} />
        <h1 className="text-2xl xxl:text-3xl border-b-1 border-theme_secondary_white/40 pb-3 mb-4">
          Add new link
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input<CreateLink>
            label="link"
            required={true}
            register={register}
            placeholder="Ex: https://kustom.cc"
            focus={true}
            error={errors.link}
          />
          <Textarea<CreateLink>
            label="description"
            register={register}
            placeholder="Ex: Collection for research papers"
          />
          <Button
            type="submit"
            className="w-full rounded-md"
            Icon={FaPlus}
            iconSize="sm"
            disabled={createLinkMutation.isPending}
            aria-disabled={createLinkMutation.isPending}
            loading={createLinkMutation.isPending}
          >
            Add Link
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default CreateLinkCard;
