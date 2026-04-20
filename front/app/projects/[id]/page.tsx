"use client";

import { use, useState } from "react";
import LateralBar from "../components/organism/LateralBar";
import ProjectSystem from "../components/organism/ProjectSystem";
import { TaskStatus } from "@/src/projects/types/projects.types";
import useProjectBoard from "@/src/projects/hooks/useProjectBoard";
import { ProjectBoardProvider } from "../context/ProjectBoardContext";
import ProjectForm from "@/app/components/organism/ProjectForm";
import { Menu } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: Props) {
  const { id } = use(params);
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([]);
  const [editProject, setEditProject] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { project, epics, loading, advanceTaskStatus, setTaskStatus } =
    useProjectBoard(id, statusFilter);

  if (loading || !project) return null;

  return (
    <ProjectBoardProvider
      projectId={id}
      technologies={project.technologies}
      onTaskStatusChange={advanceTaskStatus}
      onTaskStatusSet={setTaskStatus}
      onOpenEditForm={() => { setEditProject(true); }}
    >
      <div className="flex w-full h-full relative">
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden fixed bottom-4 left-4 z-30 bg-surface border border-border rounded-full p-3 shadow-lg text-fg-muted hover:text-fg transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <LateralBar
          taskStatus={statusFilter}
          setTaskStatus={setStatusFilter}
          project={project}
          epics={epics}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ProjectSystem epics={epics} />
      </div>
      {editProject && (
        <ProjectForm
          initialData={project}
          onClose={() => setEditProject(false)}
        />
      )}
    </ProjectBoardProvider>
  );
}
