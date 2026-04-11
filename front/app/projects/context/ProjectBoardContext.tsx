"use client";

import { createContext, useContext } from "react";
import { TaskStatus } from "@/src/projects/types/projects.types";

interface ProjectBoardContextValue {
  projectId: string;
  technologies: string[];
  onTaskStatusChange: (taskId: number, currentStatus: TaskStatus) => void;
  onTaskStatusSet: (taskId: number, status: TaskStatus) => void;
}

const ProjectBoardContext = createContext<ProjectBoardContextValue | null>(null);

export function ProjectBoardProvider({
  children,
  ...value
}: React.PropsWithChildren<ProjectBoardContextValue>) {
  return (
    <ProjectBoardContext.Provider value={value}>
      {children}
    </ProjectBoardContext.Provider>
  );
}

export function useBoardContext() {
  const ctx = useContext(ProjectBoardContext);
  if (!ctx) throw new Error("useBoardContext must be used inside ProjectBoardProvider");
  return ctx;
}
