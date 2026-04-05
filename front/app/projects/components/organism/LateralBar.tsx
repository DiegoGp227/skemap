import {
  BoardProject,
  Epic,
  TaskStatus,
} from "@/src/projects/types/projects.types";
import FilterProject from "../molecules/FilterProject";
import InfoProject from "../molecules/InfoProject";
import EpicSecction from "./EpicSecction";

interface LateralBarProps {
  taskStatus: TaskStatus[];
  setTaskStatus: React.Dispatch<React.SetStateAction<TaskStatus[]>>;
  project: BoardProject;
  epics: Epic[];
}

export default function LateralBar({
  taskStatus,
  setTaskStatus,
  project,
  epics,
}: LateralBarProps) {
  return (
    <section className="h-full max-w-72">
      <InfoProject
        tecnologies={project.technologies}
        title={project.name}
        color={project.color}
        current={project.tasksDone}
        total={project.tasksTotal}
      />
      <FilterProject taskStatus={taskStatus} setTaskStatus={setTaskStatus} />
      <EpicSecction epics={epics} />
    </section>
  );
}
