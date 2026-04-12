import ProgressBar from "@/app/components/molecules/ProgressBar";
import ActionsButtons from "./ActionsButtons";
import { useBoardContext } from "../../context/ProjectBoardContext";
import ModalDelete from "../atoms/ModalDelete";
import useDeleteProject from "@/src/projects/hooks/useDeleteProject";
import { useState } from "react";

interface InfoProjectProps {
  title: string;
  technologies: string[];
  color: string;
  current: number;
  total: number;
}

export default function InfoProject({
  title,
  technologies,
  color,
  current,
  total,
}: InfoProjectProps) {
  const { onOpenEditForm, projectId } = useBoardContext();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const { loading, handleDeleteProject } = useDeleteProject(Number(projectId));

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-fg-muted text-xs uppercase tracking-wider">
          Project
        </span>
      </div>
      <h2 className="text-fg font-bold text-2xl">{title}</h2>
      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs bg-overlay border border-border text-fg-muted rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <ProgressBar current={current} label="Task" total={total} color={color} />
      <ActionsButtons
        onEdit={onOpenEditForm}
        onDelete={() => {
          setIsDelete(true);
        }}
      />
      {isDelete && (
        <ModalDelete
          onConfirm={handleDeleteProject}
          onClose={() => setIsDelete(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
