"use client";

import { useState } from "react";
import LateralBar from "../components/organism/LateralBar";
import ProjectSistem from "../components/organism/ProjectSistem";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const [taskStatus, setTaskStatus] = useState<any>();

  const { id } = await params;
  return (
    <div className="flex w-full h-full">
      <LateralBar setTaskStatus={setTaskStatus} />
      <ProjectSistem
        id={id}
        description="una description de example"
        title="example"
        progress="12/13"
      />
    </div>
  );
}
