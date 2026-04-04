import Link from "next/link";
import TecnologiesPills from "../atoms/TecnologiesPills";
import ProgressBar from "./ProgressBar";
import useTimeAgo from "@/src/shared/hooks/useTimeAgo";

interface IProjectDivProps {
  id: number;
  title: string;
  description?: string;
  status: string;
  color: string;
  epicsCount: number;
  createdAt: string;
  technologies: string[];
  tasksTotal: number;
  tasksDone: number;
}

export default function ProjectDiv({
  id,
  title,
  description,
  status,
  color,
  epicsCount,
  createdAt,
  technologies,
  tasksTotal,
  tasksDone,
}: IProjectDivProps) {
  const timeAgo = useTimeAgo(createdAt);
  return (
    <Link href={`/projects/${id}`}>
      <div className="w-100 p-5 border-2 bg-surface border-border rounded transition duration-500 ease-in-out hover:-translate-y-1 hover:border-ring flex flex-col gap-5">
        <div className="flex gap-2 justify-between">
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-fg-secondary">{description}</p>
          </div>
          <div className="bg-[#1a3327] py-1 px-3 text-xs rounded text-success self-start">
            <p>{status}</p>
          </div>
        </div>

        <ProgressBar current={tasksDone} label="Tasks" total={tasksTotal} color={color} />
        <div className="flex">
          <div className="flex gap-2 flex-wrap w-[70%]">
            {(technologies ?? []).slice(0, 7).map((tech) => (
              <TecnologiesPills key={tech} pillsName={tech} />
            ))}
            {(technologies ?? []).length > 7 && (
              <TecnologiesPills pillsName={`+${technologies.length - 7}`} />
            )}
          </div>
          <div className="w-[30%]">
            <p>{epicsCount} Topics</p>
            <p>{timeAgo}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
