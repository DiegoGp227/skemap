import { Project } from "@/src/home/types/home.types";
import ProjectDiv from "../molecules/ProjectDiv";

interface IProjectsSectionsProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  setNewProjectForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProjectsSection({
  loading,
  projects,
  error,
  setNewProjectForm,
}: IProjectsSectionsProps) {
  return (
    <div className="flex gap-15 flex-wrap justify-center">
      {loading && <p>"loading..."</p>}
      {error && <p>{error}</p>}
      {projects && projects.length > 0 ? (
        projects.map((project) => (
          <ProjectDiv
            key={project.id}
            status={project.status}
            description={project.description}
            title={project.name}
          />
        ))
      ) : (
        <div className="w-100 h-35 p-5 border-2 bg-surface border-border rounded transition duration-500 ease-in-out hover:border-ring flex flex-col gap-5 justify-center items-center">
          <p>Projects Not Found</p>
          <button
            className="bg-blue-600 py-2 px-10 cursor-pointer rounded"
            onClick={() => {
              setNewProjectForm(true);
            }}
          >
            New Project
          </button>
        </div>
      )}
      {/* <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv> 
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv> 
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv>
      <ProjectDiv></ProjectDiv> */}
    </div>
  );
}
