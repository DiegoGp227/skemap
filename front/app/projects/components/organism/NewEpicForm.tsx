"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateEpicDto } from "@/src/projects/types/projects.types";
import useCreateEpic from "@/src/projects/hooks/useCreateEpic";

interface NewEpicFormProps {
  projectId: string;
  onClose: () => void;
}

export default function NewEpicForm({ projectId, onClose }: NewEpicFormProps) {
  const { handleCreateEpic, loading } = useCreateEpic(projectId);

  const { register, watch, handleSubmit } = useForm<CreateEpicDto>({
    defaultValues: { color: "#388bfd" },
  });

  const descriptionLength = watch("description")?.length ?? 0;
  const DESCRIPTION_MAX = 500;

  const onSubmit = async (dto: CreateEpicDto) => {
    const ok = await handleCreateEpic(dto);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className="w-96 bg-surface border border-border rounded-lg p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-fg text-lg font-semibold">New Epic</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg cursor-pointer p-1 hover:bg-overlay rounded transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-fg-muted text-sm">Name</label>
            <input
              type="text"
              id="name"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              {...register("name", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-fg-muted text-sm">Description</label>
              <span className={`text-xs ${descriptionLength >= DESCRIPTION_MAX ? "text-red-400" : descriptionLength >= DESCRIPTION_MAX * 0.9 ? "text-amber-400" : "text-fg-muted"}`}>
                {descriptionLength}/{DESCRIPTION_MAX}
              </span>
            </div>
            <input
              type="text"
              id="description"
              maxLength={DESCRIPTION_MAX}
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              {...register("description")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="color" className="text-fg-muted text-sm">Color</label>
            <input
              type="color"
              id="color"
              className="w-full h-10 rounded border border-border bg-overlay cursor-pointer px-1 py-1"
              {...register("color", { required: true })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-interactive hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors duration-300 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Epic"}
          </button>
        </form>
      </div>
    </div>
  );
}
