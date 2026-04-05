"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ArrowUpFromDot, Minus, ArrowDownToDot } from "lucide-react";
import { Epic, Task, TaskStatus } from "@/src/projects/types/projects.types";

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string }> = {
  TODO:        { label: "To Do",       bg: "bg-overlay",         text: "text-fg-muted" },
  IN_PROGRESS: { label: "In Progress", bg: "bg-blue-950",        text: "text-blue-400" },
  IN_REVIEW:   { label: "In Review",   bg: "bg-purple-950",      text: "text-purple-400" },
  DONE:        { label: "Done",        bg: "bg-green-950",       text: "text-green-400" },
};

const PRIORITY_CONFIG = {
  HIGH:   { label: "High",   color: "text-red-400",   icon: <ArrowUpFromDot className="w-3 h-3" /> },
  MEDIUM: { label: "Medium", color: "text-amber-400", icon: <Minus className="w-3 h-3" /> },
  LOW:    { label: "Low",    color: "text-fg-muted",  icon: <ArrowDownToDot className="w-3 h-3" /> },
};

function TaskRow({ task }: { task: Task }) {
  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-md cursor-pointer hover:border-ring transition duration-200">
      <span className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded ${status.bg} ${status.text} min-w-[84px] text-center`}>
        {status.label}
      </span>
      <span className="text-xs text-fg-muted font-mono shrink-0">#{task.id}</span>
      <span className="text-sm text-fg flex-1 truncate">{task.title}</span>
      {task.dueDate && (
        <span className="text-xs text-fg-muted shrink-0">
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

function EpicBlock({ epic }: { epic: Epic }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-lg hover:border-ring transition duration-200 text-left"
        style={{ borderLeftWidth: 3, borderLeftColor: epic.color }}
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-fg-muted shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: epic.color }}>
              #{epic.id}
            </span>
            <span className="text-sm font-semibold text-fg truncate">{epic.name}</span>
          </div>
          {epic.description && (
            <p className="text-xs text-fg-muted mt-0.5 truncate">{epic.description}</p>
          )}
        </div>
        <span className="text-xs text-fg-muted shrink-0">
          {epic.tasksDone}/{epic.tasksTotal} tasks
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="tasks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 pl-4 pt-2 pb-1">
              {epic.tasks.length === 0 ? (
                <p className="text-xs text-fg-muted italic px-4 py-2">No tasks</p>
              ) : (
                epic.tasks.map((task) => <TaskRow key={task.id} task={task} />)
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ProjectSistemProps {
  id: string;
  epics: Epic[];
}

export default function ProjectSistem({ epics }: ProjectSistemProps) {
  return (
    <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
      {epics.map((epic) => (
        <EpicBlock key={epic.id} epic={epic} />
      ))}
    </main>
  );
}
