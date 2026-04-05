import { Epic } from "@/src/projects/types/projects.types";
import EpicDiv from "../molecules/EpicDiv";

interface EpicSecctionProps {
  epics: Epic[];
}

export default function EpicSecction({ epics }: EpicSecctionProps) {
  return (
    <div className="flex flex-col gap-1 p-4">
      <p>Epics</p>
      {epics.map((epic) => (
        <EpicDiv key={epic.id} title={epic.name} progress={`${epic.tasksDone}/${epic.tasksTotal}`} color={epic.color} />
      ))}
    </div>
  );
}
