"use client";

import { Task, TaskStatus } from "@/src/projects/types/projects.types";
import { ArrowDownToDot, ArrowUpFromDot, Minus } from "lucide-react";

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; text: string }
> = {
  TODO: { label: "To Do", bg: "bg-overlay", text: "text-fg-muted" },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-blue-950",
    text: "text-blue-400",
  },
  IN_REVIEW: {
    label: "In Review",
    bg: "bg-purple-950",
    text: "text-purple-400",
  },
  DONE: { label: "Done", bg: "bg-green-950", text: "text-green-400" },
};

const PRIORITY_CONFIG = {
  HIGH: {
    label: "High",
    color: "text-red-400",
    icon: <ArrowUpFromDot className="w-3 h-3" />,
  },
  MEDIUM: {
    label: "Medium",
    color: "text-amber-400",
    icon: <Minus className="w-3 h-3" />,
  },
  LOW: {
    label: "Low",
    color: "text-fg-muted",
    icon: <ArrowDownToDot className="w-3 h-3" />,
  },
};

export function TaskRow({ task }: { task: Task }) {
  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-md cursor-pointer hover:border-ring transition duration-200 w-196">
      <span
        className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded ${status.bg} ${status.text} min-w-21 text-center`}
      >
        {status.label}
      </span>
      <span className="text-xs text-fg-muted font-mono shrink-0">
        #{task.id}
      </span>
      <span className="text-sm text-fg flex-1 truncate">{task.title}</span>
      {task.dueDate && (
        <span className="text-xs text-fg-muted shrink-0">
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
      <span
        className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${priority.color}`}
      >
        {priority.icon}
        {priority.label}
      </span>
    </div>
  );
}
