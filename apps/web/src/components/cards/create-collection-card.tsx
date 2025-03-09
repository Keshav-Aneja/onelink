import { cn } from "@lib/tailwind-utils";
import { Fragment } from "react/jsx-runtime";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@components/form/Input";
import Button from "@components/buttons/button";
import { FaPlus } from "react-icons/fa";
import Textarea from "@components/form/textarea";
import { IoMdClose } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollectionSchema } from "@onelink/entities/models";
import { getRandomColor } from "@lib/utils/get-random-color";
import Checkbox from "@components/form/checkbox";
import { useCreateCollection } from "@features/collections/create-collection";
interface CreateCollectionCardProps {
  className?: string;
}
const collectionSchema = CollectionSchema.omit({
  id: true,
  parent_id: true,
  owner_id: true,
});
export type CreateCollection = z.infer<typeof collectionSchema>;
const CreateCollectionCard = ({ className }: CreateCollectionCardProps) => {
  const createCollectionMutation = useCreateCollection({
    parentId: null,
    mutationConfig: {
      onSuccess: () => {
        console.log("Collection added successfull");
      },
    },
  });
  //--------
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
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<CreateCollection> = (data) => {
    const collectionData = { ...data, parent_id: null };
    createCollectionMutation.mutate(collectionData);
  };

  return (
    <Fragment>
      <div
        className={cn(
          className,
          "w-1/3 h-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] p-8",
        )}
      >
        <button
          className="absolute top-3 right-3 cursor-pointer p-2 rounded-full hover:bg-primary transition-all duration-200 ease-linear"
          id="--ol-modal-close-btn"
        >
          <IoMdClose />
        </button>
        <h1 className="text-2xl xxl:text-3xl border-b-1 border-theme_secondary_white/40 pb-3 mb-4">
          Create Collection
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            label="name"
            required={true}
            register={register}
            placeholder="Ex: Blogs"
            focus={true}
            error={errors.name}
          />
          <Textarea
            label="description"
            register={register}
            placeholder="Ex: Collection for research papers"
          />
          <Checkbox
            label="is_protected"
            falseLabel="Enable Password Protection"
            register={register}
          />
          {watch("is_protected") ? (
            <Input
              label="password"
              required={watch("is_protected")}
              register={register}
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
          >
            Add Collection
          </Button>
        </form>
      </div>
    </Fragment>
  );
};

export default CreateCollectionCard;
