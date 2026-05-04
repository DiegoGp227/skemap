"use client";

import { Task, TaskStatus } from "@/src/projects/types/projects.types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../config/taskConfig";

interface TaskRowProps {
  task: Task;
  selected?: boolean;
  onStatusChange: () => void;
  onSelect: () => void;
}

export function TaskRow({ task, selected, onStatusChange, onSelect }: TaskRowProps) {
  const status   = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-4 py-3 bg-surface border rounded-md cursor-pointer hover:border-ring transition duration-200 w-200 ${
        selected ? "border-ring" : "border-border"
      }`}
    >
      <span
        onClick={(e) => { e.stopPropagation(); onStatusChange(); }}
        className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded cursor-pointer select-none min-w-21 text-center hover:opacity-75 transition-opacity duration-150 ${status.bg} ${status.text}`}
      >
        {status.label}
      </span>
      <span className="text-xs text-fg-muted font-mono shrink-0">
        #{task.id}
      </span>
      <span className="text-sm text-fg flex-1 truncate">{task.title}</span>
      {task.dueDate && (
        <span className="hidden sm:inline text-xs text-fg-muted shrink-0">
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
      <span className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${priority.color}`}>
        {priority.icon}
        {priority.label}
      </span>
    </div>
  );
}
