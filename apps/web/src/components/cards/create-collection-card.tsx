import { cn } from "@lib/tailwind-utils";
import { Fragment } from "react/jsx-runtime";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@components/form/Input";
import Button from "@components/buttons/button";
import { FaPlus } from "react-icons/fa";
import Textarea from "@components/form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRandomColor } from "@lib/utils/get-random-color";
import Checkbox from "@components/form/checkbox";
import { useCreateCollection } from "@features/collections/create-collection";
import { useParentIdFromPath } from "@lib/utils/get-paths";
import CloseButton from "@components/buttons/close-button";
interface CreateCollectionCardProps {
  className?: string;
  closeModal?: () => void;
}
const collectionSchema = z.object({
  name: z.string(),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  is_protected: z.boolean().default(false),
  password: z.string().optional(),
});
export type CreateCollection = z.infer<typeof collectionSchema>;
const CreateCollectionCard = ({
  className,
  closeModal,
}: CreateCollectionCardProps) => {
  const pathId = useParentIdFromPath();
  if (pathId === undefined) {
    return null;
  }
  const createCollectionMutation = useCreateCollection({
    parentId: pathId,
    mutationConfig: {
      onSuccess: () => {
        console.log("Collection added successfull");
        closeModal && closeModal();
      },
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCollection>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
      color: getRandomColor(),
      is_protected: false,
      password: "",
    },
    mode: "onBlur",
  });
  const onSubmit: SubmitHandler<CreateCollection> = (data) => {
    const collectionData = { ...data, parent_id: pathId };
    createCollectionMutation.mutate(collectionData);
  };

  return (
    <Fragment>
      <div
        className={cn(
          className,
          "w-full md:w-3/4 lg:w-1/3 h-svh md:h-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] p-8",
        )}
      >
        <CloseButton close={closeModal} />
        <h1 className="text-lg md:text-2xl xxl:text-3xl border-b-1 border-theme_secondary_white/40 pb-1 md:pb-3 mb-2 md:mb-4">
          Create Collection
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input<CreateCollection>
            label="name"
            required={true}
            register={register}
            placeholder="Ex: Blogs"
            focus={true}
            error={errors.name}
          />
          <Textarea<CreateCollection>
            label="description"
            register={register}
            placeholder="Ex: Collection for research papers"
          />
          <Checkbox<CreateCollection>
            label="is_protected"
            falseLabel="Enable Password Protection"
            register={register}
            className="items-center"
          />
          {watch("is_protected") ? (
            <Input<CreateCollection>
              label="password"
              required={watch("is_protected")}
              register={register}
              type="password"
              placeholder="Enter a secure password"
              error={errors.password}
            />
          ) : (
            ""
          )}
          <Button
            type="submit"
            className="w-full rounded-md"
            Icon={FaPlus}
            iconSize="sm"
            disabled={createCollectionMutation.isPending}
            aria-disabled={createCollectionMutation.isPending}
            loading={createCollectionMutation.isPending}
          >
            Add Collection
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default CreateCollectionCard;
