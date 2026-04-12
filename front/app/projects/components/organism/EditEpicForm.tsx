"use client";

import useUpdateEpic from "@/src/projects/hooks/useUpdateEpic";
import { Epic, UpdateEpicDto } from "@/src/projects/types/projects.types";
import { useBoardContext } from "../../context/ProjectBoardContext";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

interface EditEpicFormProps {
  epic: Epic;
  onClose: () => void;
}

export default function EditEpicForm({ epic, onClose }: EditEpicFormProps) {
  const { projectId } = useBoardContext();
  const { loading, error, handleUpdateEpic } = useUpdateEpic(epic.id, projectId);

  const { handleSubmit, register, watch } = useForm<UpdateEpicDto>({
    defaultValues: {
      name: epic.name,
      description: epic.description ?? "",
      color: epic.color,
    },
  });

  const descriptionLength = watch("description")?.length ?? 0;
  const DESCRIPTION_MAX = 500;

  const onSubmit = async (dto: UpdateEpicDto) => {
    const success = await handleUpdateEpic(dto);
    if (success) onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="w-96 bg-surface border border-border rounded-lg p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: epic.color }} />
            <h2 className="text-fg text-lg font-semibold">Edit Epic</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg cursor-pointer p-1 hover:bg-overlay rounded transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="epicName" className="text-fg-muted text-sm">Name</label>
            <input
              id="epicName"
              type="text"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              {...register("name")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="epicColor" className="text-fg-muted text-sm">Color</label>
            <input
              id="epicColor"
              type="color"
              className="w-full h-10 rounded border border-border bg-overlay cursor-pointer px-1 py-1"
              {...register("color")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="epicDescription" className="text-fg-muted text-sm">Description</label>
              <span className={`text-xs ${descriptionLength >= DESCRIPTION_MAX ? "text-red-400" : descriptionLength >= DESCRIPTION_MAX * 0.9 ? "text-amber-400" : "text-fg-muted"}`}>
                {descriptionLength}/{DESCRIPTION_MAX}
              </span>
            </div>
            <input
              id="epicDescription"
              type="text"
              maxLength={DESCRIPTION_MAX}
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              {...register("description")}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-interactive hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors duration-300 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
