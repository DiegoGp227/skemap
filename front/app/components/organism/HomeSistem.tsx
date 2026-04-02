"use client";
import FilterForm from "@/app/components/organism/FilterForm";
import ProjectsSection from "./ProjectsSection";
import { useEffect, useState } from "react";
import useProjects from "@/src/home/hooks/useProjects";
import NewProjectForm from "./NewProjectForm";

export default function HomeSistem() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [newProjectForm, setNewProjectForm] = useState<boolean>(false);

  const { error, loading, projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects(status, search);
  }, [search, status, fetchProjects]);

  return (
    <>
      <FilterForm onFilterStatus={setStatus} onFilterSearch={setSearch} />
      <ProjectsSection
        projects={projects}
        loading={loading}
        error={error}
        setNewProjectForm={setNewProjectForm}
      />
      {newProjectForm && (
        <NewProjectForm
          onClose={() => setNewProjectForm(false)}
          isNewProject={true}
        />
      )}
    </>
  );
}
