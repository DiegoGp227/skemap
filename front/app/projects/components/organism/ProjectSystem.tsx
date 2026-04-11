"use client";

import { useState } from "react";
import { Epic, TaskStatus } from "@/src/projects/types/projects.types";
import { EpicBlock } from "./EpicBlock";
import { TaskDetailPanel } from "./TaskDetailPanel";

interface ProjectSystemProps {
  id: string;
  epics: Epic[];
  technologies: string[];
  onTaskStatusChange: (taskId: number, currentStatus: TaskStatus) => void;
  onTaskStatusSet: (taskId: number, status: TaskStatus) => void;
}

export default function ProjectSystem({ id, epics, technologies, onTaskStatusChange, onTaskStatusSet }: ProjectSystemProps) {
  const [selected, setSelected] = useState<{ taskId: number; epicId: number } | null>(null);

  // Siempre derivado del array — se actualiza solo cuando SWR muta
  const selectedEpic = selected ? epics.find((e) => e.id === selected.epicId) ?? null : null;
  const selectedTask = selected ? selectedEpic?.tasks.find((t) => t.id === selected.taskId) ?? null : null;

  function handleTaskSelect(taskId: number, epicId: number) {
    setSelected((prev) =>
      prev?.taskId === taskId ? null : { taskId, epicId }
    );
  }

  return (
    <>
      <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {epics.map((epic) => (
          <EpicBlock
            key={epic.id}
            epic={epic}
            projectId={id}
            technologies={technologies}
            onTaskStatusChange={onTaskStatusChange}
            onTaskSelect={(task) => handleTaskSelect(task.id, epic.id)}
            selectedTaskId={selected?.taskId ?? null}
          />
        ))}
      </main>

      <TaskDetailPanel
        task={selectedTask}
        epicColor={selectedEpic?.color}
        epicName={selectedEpic?.name}
        onStatusChange={onTaskStatusSet}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
