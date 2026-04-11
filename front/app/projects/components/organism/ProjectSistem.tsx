"use client";

import { useState } from "react";
import { Epic, Task, TaskStatus } from "@/src/projects/types/projects.types";
import { EpicBlock } from "./EpicBlock";
import { TaskDetailPanel } from "./TaskDetailPanel";

interface ProjectSistemProps {
  id: string;
  epics: Epic[];
  onTaskStatusChange: (taskId: number, currentStatus: TaskStatus) => void;
}

export default function ProjectSistem({ id, epics, onTaskStatusChange }: ProjectSistemProps) {
  const [selectedTask, setSelectedTask] = useState<{ task: Task; epic: Epic } | null>(null);

  function handleTaskSelect(task: Task, epic: Epic) {
    setSelectedTask((prev) =>
      prev?.task.id === task.id ? null : { task, epic }
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
            onTaskStatusChange={onTaskStatusChange}
            onTaskSelect={(task) => handleTaskSelect(task, epic)}
            selectedTaskId={selectedTask?.task.id ?? null}
          />
        ))}
      </main>

      <TaskDetailPanel
        task={selectedTask?.task ?? null}
        epicColor={selectedTask?.epic.color}
        epicName={selectedTask?.epic.name}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
}
