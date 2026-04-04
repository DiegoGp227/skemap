import { ArrowUpFromDot, ChevronRight } from "lucide-react";

interface ProjectSistemProps {
  id: string;
  title: string;
  description: string;
  progress: string;
}

export default function ProjectSistem({
  id,
  title,
  description,
  progress,
}: ProjectSistemProps) {
  return (
    <main className="p-5 flex flex-col gap-5">
      {/* Proyecto #{id} */}
      <div className="flex w-215 h-16 bg-surface items-center justify-between p-4 border-l-4 border-purple-500 rounded cursor-pointer">
        <div className="flex items-center gap-5">
          <button>
            <ChevronRight className="text-fg-muted" />
          </button>
          <div>
            <div className="text-fg">{title}</div>
            <div className="text-fg-muted">{description}</div>
          </div>
        </div>
        <div className="text-fg-muted">{progress} stories</div>
      </div>

      <div className="flex items-center flex-col gap-2">
        <div className="flex w-200 h-12 bg-surface items-center justify-between p-4 rounded cursor-pointer">
          <div className="flex items-center gap-5">
            <button className="px-4 py-1 text-xs text-fg-muted hover:text-fg hover:bg-overlay transition duration-500 bg-overlay rounded border-border border-2 hover:border-ring">
              To Do
            </button>
            <div>
              <p className="text-fg-muted text-xs">E3-S1</p>
            </div>
            <div>
              <div className="text-fg text-xs">{description}</div>
            </div>
          </div>
          <div className=" text-red-500 flex items-center gap-1 text-xs">
            <ArrowUpFromDot className="text-red-500 w-3 h-3" />
            Higth
          </div>
        </div>
        <div className="flex w-200 h-12 bg-surface items-center justify-between p-4 rounded cursor-pointer">
          <div className="flex items-center gap-5">
            <button className="px-4 py-1 text-xs text-fg-muted hover:text-fg hover:bg-overlay transition duration-500 bg-overlay rounded border-border border-2 hover:border-ring">
              To Do
            </button>
            <div>
              <p className="text-fg-muted text-xs">E3-S1</p>
            </div>
            <div>
              <div className="text-fg text-xs">{description}</div>
            </div>
          </div>
          <div className=" text-red-500 flex items-center gap-1 text-xs">
            <ArrowUpFromDot className="text-red-500 w-3 h-3" />
            Higth
          </div>
        </div>
      </div>
    </main>
  );
}
