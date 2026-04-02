import { X } from "lucide-react";
import { useForm } from "react-hook-form";

interface INewProjectFormProps {
  onClose: () => void;
  isNewProject: boolean;
}

export default function NewProjectForm({
  onClose,
  isNewProject,
}: INewProjectFormProps) {
  const { handleSubmit, register } = useForm();

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
          <h2 className="text-fg text-lg font-semibold">{isNewProject ? "New Project" : "Update Project"}</h2>
          <button
            onClick={onClose}
            className="text-fg-muted hover:text-fg cursor-pointer p-1 hover:bg-overlay rounded transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(() => {})} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="projectName" className="text-fg-muted text-sm">
              Name
            </label>
            <input
              type="text"
              id="projectName"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              {...register("name")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="color" className="text-fg-muted text-sm">
              Color
            </label>
            <input
              type="color"
              id="color"
              defaultValue="#388bfd"
              className="w-full h-10 rounded border border-border bg-overlay cursor-pointer px-1 py-1"
              {...register("color")}
            />
          </div>

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

          <button
            type="submit"
            className="mt-1 bg-interactive hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors duration-300 cursor-pointer"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
