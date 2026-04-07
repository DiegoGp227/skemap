import { TaskStatus } from "@/src/projects/types/projects.types";
import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewTaskForm() {
  const [criterionInput, setCriterionInput] = useState("");
  const [criteria, setCriteria] = useState<string[]>([]);

  const handleAddCriterion = () => {
    const trimmed = criterionInput.trim();
    if (!trimmed) return;
    setCriteria((prev) => [...prev, trimmed]);
    setCriterionInput("");
  };

  const handleRemoveCriterion = (index: number) => {
    setCriteria((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCriterion();
    }
  };

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectDto>({ defaultValues: { technologies: [] } });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className="w-96 bg-surface border border-border rounded-lg p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-fg text-lg font-semibold">New Task</h2>
          <button
            className="text-fg-muted hover:text-fg cursor-pointer p-1 hover:bg-overlay rounded transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="taskTitle" className="text-fg-muted text-sm">
              Title
            </label>
            <input
              type="text"
              id="taskTitle"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
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
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1">
            <label htmlFor="priority" className="text-fg-muted text-sm">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
              defaultValue="MEDIUM"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Technologies */}
          <div className="flex flex-col gap-1">
            <label htmlFor="technologies" className="text-fg-muted text-sm">
              Technologies
            </label>
            <input
              type="text"
              id="technologies"
              className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full"
            />
          </div>

          {/* Acceptance Criteria */}
          <div className="flex flex-col gap-2">
            <label className="text-fg-muted text-sm">Acceptance Criteria</label>

            {/* Input + Add button */}
            <div className="flex gap-2">
              <input
                type="text"
                value={criterionInput}
                onChange={(e) => setCriterionInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a criterion..."
                className="bg-overlay border border-border text-fg px-3 py-2 rounded focus:outline-none focus:border-ring transition-colors duration-300 w-full text-sm"
              />
              <button
                type="button"
                onClick={handleAddCriterion}
                className="flex items-center gap-1 px-3 py-2 bg-overlay border border-border text-fg-muted hover:text-fg hover:bg-surface rounded transition-colors duration-200 text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            {criteria.length > 0 && (
              <ul className="flex flex-col gap-1 mt-1">
                {criteria.map((criterion, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between gap-2 bg-overlay border border-border rounded px-3 py-2 text-sm text-fg"
                  >
                    <span className="flex-1 leading-snug">{criterion}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCriterion(index)}
                      className="text-fg-muted hover:text-fg shrink-0 cursor-pointer transition-colors duration-200"
                      aria-label="Remove criterion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
