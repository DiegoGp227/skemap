import { Epic } from "@/src/projects/types/projects.types";
import { EpicBlock } from "./EpicBlock";

interface ProjectSistemProps {
  id: string;
  epics: Epic[];
}

export default function ProjectSistem({ epics }: ProjectSistemProps) {
  return (
    <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
      {epics.map((epic) => (
        <EpicBlock key={epic.id} epic={epic} />
      ))}
    </main>
  );
}
