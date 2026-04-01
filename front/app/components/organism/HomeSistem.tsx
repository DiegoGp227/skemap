"use client";
import FilterForm from "@/src/home/forms/FilterForm";
import ProjectsSection from "./ProjectsSection";
import { useState } from "react";

export default function HomeSistem() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  function ChangeFilterStatus(status: string) {
    setStatus(status);
    console.log(status);
  }

  function ChangeFilterSearch(search: string) {
    setSearch(search);
    console.log(search);
  }

  return (
    <>
      <FilterForm
        onFilterStatus={ChangeFilterStatus}
        onFilterSearch={ChangeFilterSearch}
      />
      <ProjectsSection />
    </>
  );
}
