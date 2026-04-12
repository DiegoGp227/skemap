"use client";
import FilterForm from "@/app/components/organism/FilterForm";
import ProjectsSection from "./ProjectsSection";
import { useState } from "react";
import useProjects from "@/src/home/hooks/useProjects";
import ProjectForm from "./ProjectForm";

export default function HomeSystem() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [newProjectForm, setNewProjectForm] = useState<boolean>(false);

  const { error, loading, projects } = useProjects(status, search);

  return (
    <>
      <FilterForm onFilterStatus={setStatus} onFilterSearch={setSearch} />
      <ProjectsSection
        projects={projects}
        loading={loading}
        error={error}
        onNewProject={() => setNewProjectForm(true)}
      />
      {newProjectForm && (
        <ProjectForm
          onClose={() => setNewProjectForm(false)}
          isNewProject={true}
        />
      )}
    </>
  );
}
