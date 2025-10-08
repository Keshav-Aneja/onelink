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
import { useParentIdFromPath } from "@lib/utils/get-paths";
import CloseButton from "@components/buttons/close-button";
import { nanoid } from "@reduxjs/toolkit";
import { useCreateLink } from "@features/links/create-link";
import Checkbox from "@components/form/checkbox";
import { ImSpinner2 } from "react-icons/im";
interface CreateLinkCardProps {
  className?: string;
  closeModal?: () => void;
}

const linkSchema = LinkSchema.pick({ description: true, link: true }).and(
  z.object({
    notification: z.boolean().default(false),
  }),
);
export type CreateLink = z.infer<typeof linkSchema>;
const CreateLinkCard = ({ className, closeModal }: CreateLinkCardProps) => {
  const pathId = useParentIdFromPath();
  if (pathId === undefined) {
    return null;
  }
  const createLinkMutation = useCreateLink({
    parentId: pathId,
    mutationConfig: {
      onSuccess: () => {
        closeModal && closeModal();
      },
    },
  });

  //--------
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateLink>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      description: "",
      link: "",
      notification: false,
    },
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<CreateLink> = async (data) => {
    const linkData = {
      ...data,
      parent_id: pathId,
      fingerprint: nanoid(10),
      subscribed: data.notification,
    };
    console.log(linkData);
    createLinkMutation.mutate(linkData);
    // await createLink(linkData);
  };
  if (createLinkMutation.isSuccess) {
    setValue("link", "");
    setValue("description", "");
    setValue("notification", false);
  }
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
          <Checkbox<CreateLink>
            label="notification"
            falseLabel="Get notified of updates from this website (new articles, posts, etc.)."
            register={register}
          />
          <Button
            type="submit"
            className="w-full rounded-md"
            Icon={FaPlus}
            iconSize="sm"
            disabled={createLinkMutation.isPending}
            aria-disabled={createLinkMutation.isPending}
            loading={createLinkMutation.isPending}
            Loader={
              <span className="flex items-center justify-center w-full gap-4">
                <ImSpinner2 className="animate-spin" />
                <p>Creating Link</p>
              </span>
            }
          >
            Add Link
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default CreateLinkCard;
