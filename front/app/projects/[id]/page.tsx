import LateralBar from "../components/organism/LateralBar";
import ProjectSistem from "../components/organism/ProjectSistem";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="flex w-full h-full">
      <LateralBar />
      <ProjectSistem id={id} />
    </div>
  );
}
