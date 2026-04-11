"use client";

import { use, useState } from "react";
import LateralBar from "../components/organism/LateralBar";
import ProjectSystem from "../components/organism/ProjectSystem";
import { TaskStatus } from "@/src/projects/types/projects.types";
import useProjectBoard from "@/src/projects/hooks/useProjectBoard";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: Props) {
  const { id } = use(params);
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([]);
  const { project, epics, loading, advanceTaskStatus, setTaskStatus } = useProjectBoard(
    id,
    statusFilter,
  );

  if (loading || !project) return null;

  return (
    <div className="flex w-full h-full">
      <LateralBar
        taskStatus={statusFilter}
        setTaskStatus={setStatusFilter}
        project={project}
        epics={epics}
      />
      <ProjectSystem
        id={id}
        epics={epics}
        technologies={project.technologies}
        onTaskStatusChange={advanceTaskStatus}
        onTaskStatusSet={setTaskStatus}
      />
    </div>
  );
}
