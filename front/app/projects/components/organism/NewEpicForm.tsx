"use client";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

interface NewEpicFormProps {
  onClose: () => void;
}

export default function NewEpicForm({ onClose }: NewEpicFormProps) {
  const { register } = useForm();
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

        <form
          className="flex flex-col gap-4"
          // onSubmit={handleSubmit(onSubmit)}
        >
          {" "}
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="taskTitle" className="text-fg-muted text-sm">
              Name
            </label>
            <input
              type="text"
              id="taskTitle"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              {...register("name")}
            />
          </div>
          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-fg-muted text-sm">
              Description
            </label>
            <input
              type="text"
              id="description"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              {...register("description")}
            />
          </div>
          {/* color */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-fg-muted text-sm">
              Color
            </label>
            <input
              type="text"
              id="description"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              {...register("description")}
            />
          </div>
          <button
            type="submit"
            className="border-2 border-border px-1 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-500"
            // disabled={loading}
          >
            {/* {loading ? "loading..." : "send"} */}
          </button>
        </form>
      </div>
    </div>
  );
}
