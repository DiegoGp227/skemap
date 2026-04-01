import { Project } from "@/src/home/types/home.types";
import ProjectDiv from "../molecules/ProjectDiv";

interface IProjectsSectionsProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export default function ProjectsSection({
  loading,
  projects,
  error,
}: IProjectsSectionsProps) {
  return (
    <div className="flex gap-15 flex-wrap justify-center">
      {loading ?? <p>"loading..."</p>}

      {error ?? <p>{error}</p>}
      {projects && projects.length > 0 ? (
        projects.map((project) => <ProjectDiv key={project.id} />)
      ) : (
        <div>
          <p>No hay proyectos</p>
        </div>
      )}
    </div>
  );
}
