import { useDeleteCollection } from "@features/collections/delete-collection";
import { cn } from "@lib/tailwind-utils";
import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import ConfirmDialog from "@components/dialogs/confirm-dialog";

const DeleteCollectionButton = ({ id, name }: { id: string; name: string }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const deleteMutation = useDeleteCollection({
    mutationConfig: {
      onSuccess: () => {
        setIsConfirmOpen(false);
        console.log("Collection deleted successfully");
      },
      onError: (error) => {
        console.error("Failed to delete collection:", error);
        setIsConfirmOpen(false);
      },
    },
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate({ id });
  };

  const handleCloseDialog = () => {
    if (!deleteMutation.isPending) {
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <button
        className={cn(
          "bg-black text-theme_secondary_white/70 hover:text-white rounded-full p-1 xxl:p-1.5 text-sm xxl:text-base cursor-pointer hover:bg-red-600 transition-all duration-200 ease-linear relative --delete-collection-btn",
        )}
        onClick={handleDeleteClick}
        title="Delete collection"
      >
        {deleteMutation.isPending ? (
          <ImSpinner2 className="animate-spin" />
        ) : (
          <FiTrash />
        )}
      </button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Collection"
        message={
          <div>
            <p className="mb-2">
              Are you sure you want to delete <strong>"{name}"</strong>?
            </p>
            <p className="text-primary font-medium">
              This will permanently delete all links and nested collections
              inside it.
            </p>
          </div>
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default DeleteCollectionButton;
