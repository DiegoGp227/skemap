import { Epic, TaskStatus } from "@/src/projects/types/projects.types";
import { EpicBlock } from "./EpicBlock";
import NewTaskForm from "../molecules/NewTaskForm";

interface ProjectSistemProps {
  id: string;
  epics: Epic[];
  onTaskStatusChange: (taskId: number, currentStatus: TaskStatus) => void;
}

export default function ProjectSistem({
  epics,
  onTaskStatusChange,
}: ProjectSistemProps) {
  return (
    <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
      {epics.map((epic) => (
        <EpicBlock
          key={epic.id}
          epic={epic}
          onTaskStatusChange={onTaskStatusChange}
        />
      ))}
      <NewTaskForm />
    </main>
  );
}
