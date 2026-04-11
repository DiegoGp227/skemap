import {
  BoardProject,
  Epic,
  TaskStatus,
} from "@/src/projects/types/projects.types";
import FilterProject from "../molecules/FilterProject";
import InfoProject from "../molecules/InfoProject";
import EpicSection from "./EpicSection";

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
        technologies={project.technologies}
        title={project.name}
        color={project.color}
        current={project.tasksDone}
        total={project.tasksTotal}
      />
      <FilterProject taskStatus={taskStatus} setTaskStatus={setTaskStatus} />
      <EpicSection epics={epics} projectId={project.id.toString()} />
    </section>
  );
}
