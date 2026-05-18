import { createPortal } from "react-dom";
import { cn } from "@lib/tailwind-utils";
import {
  PiStar,
  PiStarFill,
  PiTrash,
  PiCopy,
  PiX,
  PiDotsThree,
} from "react-icons/pi";
import { TbFolderShare } from "react-icons/tb";
import { HiOutlineTag } from "react-icons/hi";
import type { Link } from "@onelink/entities/models";

interface BulkActionBarProps {
  selectedIds: string[];
  allLinks: Link[];
  onClear: () => void;
  onDelete: () => void;
  onStar: () => void;
  onUnstar: () => void;
  onMove: () => void;
  onTag: () => void;
  onCopyUrls: () => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export default function BulkActionBar({
  selectedIds,
  allLinks,
  onClear,
  onDelete,
  onStar,
  onUnstar,
  onMove,
  onTag,
  onCopyUrls,
  isDeleting,
  isUpdating,
}: BulkActionBarProps) {
  const count = selectedIds.length;
  if (count === 0) return null;

  const selectedLinks = allLinks.filter((l) => selectedIds.includes(l.id));
  const allStarred = selectedLinks.length > 0 && selectedLinks.every((l) => l.is_starred);

  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-1 bg-[#111] border border-white/20 rounded-xl shadow-2xl px-2 py-1.5 min-w-[420px] max-w-[90vw]">
        {/* Clear + count */}
        <button
          onClick={onClear}
          title="Clear selection (Esc)"
          className="flex items-center justify-center w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        >
          <PiX className="text-sm" />
        </button>

        <span className="text-xs font-semibold text-white px-1.5 shrink-0">
          {count} selected
        </span>

        <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

        {/* Star / Unstar */}
        <ActionButton
          onClick={allStarred ? onUnstar : onStar}
          title={allStarred ? "Unstar all" : "Star all"}
          disabled={isUpdating}
          icon={
            allStarred
              ? <PiStarFill className="text-yellow-400" />
              : <PiStar />
          }
          label={allStarred ? "Unstar" : "Star"}
        />

        {/* Tag */}
        <ActionButton
          onClick={onTag}
          title="Tag selected"
          disabled={isUpdating}
          icon={<HiOutlineTag />}
          label="Tag"
        />

        {/* Move */}
        <ActionButton
          onClick={onMove}
          title="Move to collection"
          disabled={isUpdating}
          icon={<TbFolderShare />}
          label="Move"
        />

        {/* Copy URLs */}
        <ActionButton
          onClick={onCopyUrls}
          title="Copy URLs"
          icon={<PiCopy />}
          label="Copy URLs"
        />

        <div className="flex-1" />

        {/* Delete — visually separated */}
        <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />
        <button
          onClick={onDelete}
          title="Delete selected"
          disabled={isDeleting}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
            "text-red-400 hover:text-red-300 hover:bg-red-500/10",
            isDeleting && "opacity-50 cursor-not-allowed",
          )}
        >
          <PiTrash className="text-sm" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}

function ActionButton({
  onClick,
  title,
  icon,
  label,
  disabled,
}: {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
        "text-white/60 hover:text-white hover:bg-white/10",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span className="text-sm">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
