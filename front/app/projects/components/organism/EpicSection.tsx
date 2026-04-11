import { Epic } from "@/src/projects/types/projects.types";
import EpicDiv from "../molecules/EpicDiv";
import { useState } from "react";
import NewEpicForm from "./NewEpicForm";

interface EpicSectionProps {
  epics: Epic[];
  projectId: string;
}

export default function EpicSection({ epics, projectId }: EpicSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-1 p-4">
      <div className="flex justify-between">
        <p className="font-bold">Epics</p>
        <button
          className="border px-3 rounded border-border text-fg-muted hover:bg-surface transition duration-500 hover:text-fg"
          onClick={() => setShowForm(true)}
        >
          New Epic
        </button>
      </div>
      {epics.map((epic) => (
        <EpicDiv
          key={epic.id}
          title={epic.name}
          progress={`${epic.tasksDone}/${epic.tasksTotal}`}
          color={epic.color}
        />
      ))}
      {showForm && <NewEpicForm projectId={projectId} onClose={() => setShowForm(false)} />}
    </div>
  );
}
