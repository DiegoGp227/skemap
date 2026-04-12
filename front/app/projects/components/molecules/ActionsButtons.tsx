import { Pencil, Trash2 } from "lucide-react";

interface ActionsButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}

export default function ActionsButtons({ onEdit, onDelete, compact }: ActionsButtonsProps) {
  if (compact) {
    return (
      <div className="flex gap-1 shrink-0 m-2">
        <button
          onClick={onEdit}
          className="p-1.5 text-fg-muted hover:text-fg hover:bg-overlay rounded transition-colors duration-200 cursor-pointer"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-fg-muted hover:text-red-400 hover:bg-overlay rounded transition-colors duration-200 cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-border py-2 flex gap-2 justify-end">
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-overlay border border-border text-fg-muted hover:text-fg hover:border-ring rounded transition-colors duration-200 cursor-pointer"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-overlay border border-border text-fg-muted hover:text-red-400 hover:border-red-800/60 rounded transition-colors duration-200 cursor-pointer"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </button>
    </div>
  );
}
