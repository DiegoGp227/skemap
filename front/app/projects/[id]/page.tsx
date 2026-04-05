"use client";

import { use, useState } from "react";
import LateralBar from "../components/organism/LateralBar";
import ProjectSistem from "../components/organism/ProjectSistem";
import { TaskStatus } from "@/src/projects/types/projects.types";
import useProjectBoard from "@/src/projects/hooks/useProjectBoard";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: Props) {
  const { id } = use(params);
  const [taskStatus, setTaskStatus] = useState<TaskStatus[]>([]);
  const { project, epics, loading, advanceTaskStatus } = useProjectBoard(id, taskStatus);

  if (loading || !project) return null;

  return (
    <div className="flex w-full h-full">
      <LateralBar taskStatus={taskStatus} setTaskStatus={setTaskStatus} project={project} epics={epics} />
      <ProjectSistem id={id} epics={epics} onTaskStatusChange={advanceTaskStatus} />
    </div>
  );
}
