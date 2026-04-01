"use client";
import FilterForm from "@/src/home/forms/FilterForm";
import ProjectsSection from "./ProjectsSection";
import { useEffect, useState } from "react";
import useProjects from "@/src/home/hooks/useProjects";

export default function HomeSistem() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const { error, loading, projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects(status, search);
  }, [search, status, fetchProjects]);

  return (
    <>
      <FilterForm onFilterStatus={setStatus} onFilterSearch={setSearch} />
      <ProjectsSection projects={projects} loading={loading} error={error} />
    </>
  );
}
