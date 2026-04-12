"use client";

import { Trash2, X } from "lucide-react";

interface ModalDeleteProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

export default function ModalDelete({ title, description, onConfirm, onClose, loading }: ModalDeleteProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="w-80 bg-surface border border-border rounded-lg p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950/50 border border-red-800/40 rounded-lg">
              <Trash2 className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="text-fg font-semibold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-fg-muted hover:text-fg cursor-pointer p-1 hover:bg-overlay rounded transition-colors duration-200 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-fg-muted text-sm leading-relaxed">{description}</p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-overlay border border-border text-fg-muted hover:text-fg hover:border-ring rounded transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-red-950/50 border border-red-800/40 text-red-400 hover:bg-red-900/60 hover:border-red-600/60 rounded transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
