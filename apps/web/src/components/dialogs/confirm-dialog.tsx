import { cn } from "@lib/tailwind-utils";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "@components/buttons/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmDialogProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      <div className="relative z-[10000] w-full max-w-md mx-4 p-6 md:p-8 bg-theme_primary_black backdrop-blur-sm border-[2px] border-white/20 rounded-md">
        <h2 className="text-xl xxl:text-2xl font-semibold text-white border-b-1 border-theme_secondary_white/40 pb-3 mb-4">
          {title}
        </h2>
        <div className="text-sm md:text-base text-theme_secondary_white/80 mb-6">
          {message}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "text-xs md:text-sm py-2 px-4 rounded-md",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "text-xs md:text-sm py-2 px-4 rounded-md",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmDialog;
