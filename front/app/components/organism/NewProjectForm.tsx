"use client";

import useCreateProject from "@/src/home/hooks/useCreateProject";
import { CreateProjectDto } from "@/src/home/types/home.types";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface INewProjectFormProps {
  onClose: () => void;
  isNewProject: boolean;
}

export default function NewProjectForm({
  onClose,
  isNewProject,
}: INewProjectFormProps) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectDto>({ defaultValues: { technologies: [] } });

  const { error, handleCreateProject } = useCreateProject();
  const [techInput, setTechInput] = useState("");

  const descriptionLength = watch("description")?.length ?? 0;
  const DESCRIPTION_MAX = 500;

  const technologies = watch("technologies") ?? [];

  function addTech() {
    const value = techInput.trim();
    if (!value || technologies.includes(value) || technologies.length >= 20) return;
    setValue("technologies", [...technologies, value]);
    setTechInput("");
  }

  function removeTech(tech: string) {
    setValue("technologies", technologies.filter((t) => t !== tech));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTech();
    } else if (e.key === "Backspace" && techInput === "" && technologies.length > 0) {
      removeTech(technologies[technologies.length - 1]);
    }
  }

  const onSubmit = async (dto: CreateProjectDto) => {
    const success = await handleCreateProject(dto);
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
          <h2 className="text-fg text-lg font-semibold">
            {isNewProject ? "New Project" : "Update Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-fg-muted hover:text-fg cursor-pointer p-1 hover:bg-overlay rounded transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

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
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color.message}</p>
          )}

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
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-fg-muted text-sm">Technologies</label>
            <div className="flex flex-wrap gap-1.5 bg-overlay border border-border rounded px-3 py-2 focus-within:border-ring transition-colors duration-300 min-h-10.5">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="flex items-center gap-1 bg-surface border border-border text-fg text-sm px-2 py-0.5 rounded-full"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-fg-muted hover:text-fg cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTech}
                placeholder={technologies.length === 0 ? "React, Node.js..." : ""}
                className="flex-1 min-w-20 bg-transparent text-fg text-sm focus:outline-none placeholder:text-fg-muted"
              />
            </div>
            <p className="text-fg-muted text-xs">Enter or comma to add · Backspace to remove</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
