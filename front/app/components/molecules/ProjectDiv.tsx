import Link from "next/link";
import TecnologiesPills from "../atoms/TecnologiesPills";
import ProgressBar from "./ProgressBar";
import useTimeAgo from "@/src/shared/hooks/useTimeAgo";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE:    { label: "Active",    className: "bg-[#14532d] text-[#4ade80]"  },
  COMPLETED: { label: "Completed", className: "bg-[#1e3a5f] text-[#60a5fa]"  },
  ARCHIVED:  { label: "Archived",  className: "bg-overlay   text-fg-muted"    },
};

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
    <div className="w-full border-2 bg-surface border-border rounded transition duration-500 ease-in-out hover:border-ring flex flex-col justify-between">
      <Link href={`/projects/${id}`}>
        <div className="p-5 flex flex-col gap-5">
          <div className="flex gap-2 justify-between">
            <div>
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="text-fg-muted">{description}</p>
            </div>
            <div className={`py-1 px-3 text-xs font-semibold rounded self-start ${STATUS_CONFIG[status]?.className ?? STATUS_CONFIG.ACTIVE.className}`}>
              {STATUS_CONFIG[status]?.label ?? status}
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
    </div>
  );
}
