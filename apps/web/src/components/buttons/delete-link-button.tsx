import { useDeleteLink } from "@features/links/delete-link";
import { cn } from "@lib/tailwind-utils";
import { FiTrash } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";

const DeleteLinkButton = ({ id, subtle = false }: { id: string; subtle?: boolean }) => {
  const deleteMutation = useDeleteLink({
    mutationConfig: {
      onSuccess: () => {},
    },
  });
  const handleDeleteLink = () => {
    if (!deleteMutation.isPending) {
      deleteMutation.mutate({ id });
    }
  };
  return (
    <button
      className={cn(
        subtle
          ? "text-sm cursor-pointer text-theme_secondary_white/40 hover:text-red-400 transition-colors"
          : "bg-black text-theme_secondary_white/70 hover:text-white rounded-full p-1 xxl:p-1.5 text-sm xxl:text-base cursor-pointer hover:bg-primary",
      )}
      onClick={handleDeleteLink}
    >
      {deleteMutation.isPending ? (
        <ImSpinner2 className="animate-spin" />
      ) : (
        <FiTrash />
      )}
    </button>
  );
};

export default DeleteLinkButton;
