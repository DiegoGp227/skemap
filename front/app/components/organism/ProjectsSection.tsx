import { Project } from "@/src/home/types/home.types";
import ProjectDiv from "../molecules/ProjectDiv";
import { FolderOpen } from "lucide-react";

interface IProjectsSectionsProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onNewProject: () => void;
}

export default function ProjectsSection({
  loading,
  projects,
  error,
  onNewProject,
}: IProjectsSectionsProps) {
  return (
    <div className="flex gap-15 flex-wrap justify-center">
      {loading && <p>loading...</p>}
      {error && <p>{error}</p>}

      {projects && projects.length > 0 ? (
        <div className="flex flex-col gap-5">
          <div className="w-full flex justify-center">
            <button
              className="bg-blue-600 py-2 px-10 cursor-pointer rounded"
              onClick={onNewProject}
            >
              New Project
            </button>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectDiv
                key={project.id}
                id={project.id}
                status={project.status}
                description={project.description}
                title={project.name}
                color={project.color}
                epicsCount={project._count.epics}
                createdAt={project.createdAt}
                technologies={project.technologies}
                tasksTotal={project.tasksTotal}
                tasksDone={project.tasksDone}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="p-4 rounded-full bg-overlay border border-border">
            <FolderOpen className="w-6 h-6 text-fg-muted" />
          </div>
          <div>
            <p className="text-fg font-semibold">No projects yet</p>
            <p className="text-fg-muted text-sm mt-1">Create your first project to get started.</p>
          </div>
          <button
            onClick={onNewProject}
            className="mt-1 px-4 py-2 text-sm font-medium bg-overlay border border-border text-fg-muted hover:text-fg hover:border-ring rounded transition-colors duration-200 cursor-pointer"
          >
            New Project
          </button>
        </div>
      )}
    </div>
  );
}
