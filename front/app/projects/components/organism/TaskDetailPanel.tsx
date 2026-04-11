"use client";

import { Task, TaskPriority, TaskStatus } from "@/src/projects/types/projects.types";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpFromDot, ArrowDownToDot, Minus } from "lucide-react";

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string }> = {
  TODO:        { label: "To Do",       bg: "bg-overlay",      text: "text-fg-muted"   },
  IN_PROGRESS: { label: "In Progress", bg: "bg-blue-950",     text: "text-blue-400"   },
  IN_REVIEW:   { label: "In Review",   bg: "bg-purple-950",   text: "text-purple-400" },
  DONE:        { label: "Done",        bg: "bg-green-950",    text: "text-green-400"  },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: React.ReactNode }> = {
  HIGH:   { label: "High",   color: "text-red-400",   icon: <ArrowUpFromDot   className="w-3 h-3" /> },
  MEDIUM: { label: "Medium", color: "text-amber-400", icon: <Minus            className="w-3 h-3" /> },
  LOW:    { label: "Low",    color: "text-fg-muted",  icon: <ArrowDownToDot   className="w-3 h-3" /> },
};

// Fake data to fill missing fields
const FAKE_STACK = ["React", "TypeScript", "PostgreSQL", "Express"];
const FAKE_DESC =
  "This task covers the implementation and integration of the feature described above. Ensure all acceptance criteria are met before marking as done.";

interface TaskDetailPanelProps {
  task: Task | null;
  epicColor?: string;
  epicName?: string;
  onClose: () => void;
}

export function TaskDetailPanel({ task, epicColor, epicName, onClose }: TaskDetailPanelProps) {
  const status   = task ? STATUS_CONFIG[task.status]   : null;
  const priority = task ? PRIORITY_CONFIG[task.priority] : null;

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 h-full w-[380px] z-50 flex flex-col bg-base border-l border-border overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div
                className="text-xs font-bold"
                style={{ color: epicColor ?? "#7d8590" }}
              >
                {epicName ?? "Epic"} · #{task.id}
              </div>
              <button
                onClick={onClose}
                className="text-fg-muted hover:text-fg transition-colors duration-150 -mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <h2 className="px-6 text-base font-bold text-fg leading-snug mb-4">
              {task.title}
            </h2>

            {/* Meta badges */}
            <div className="px-6 flex flex-wrap gap-2 mb-5">
              {status && (
                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              )}
              {priority && (
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-overlay ${priority.color}`}>
                  {priority.icon}
                  {priority.label}
                </span>
              )}
              {task.dueDate && (
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-overlay text-fg-muted">
                  ⏱ {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            <hr className="border-border mx-6 mb-5" />

            {/* Description */}
            <section className="px-6 mb-5">
              <p className="text-[11px] tracking-widest uppercase text-fg-muted mb-2">
                Description
              </p>
              <p className="text-sm text-fg-subtle leading-relaxed">
                {task.description ?? FAKE_DESC}
              </p>
            </section>

            {/* Acceptance criteria */}
            {(task.acceptanceCriteria?.length > 0) && (
              <section className="px-6 mb-5">
                <p className="text-[11px] tracking-widest uppercase text-fg-muted mb-3">
                  Acceptance criteria
                </p>
                <ul className="flex flex-col gap-2">
                  {task.acceptanceCriteria.map((ac) => (
                    <li key={ac.id} className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 text-xs ${ac.done ? "text-green-500" : "text-fg-muted"}`}>
                        {ac.done ? "✓" : "○"}
                      </span>
                      <span className={`text-sm leading-snug ${ac.done ? "line-through text-fg-muted" : "text-fg-subtle"}`}>
                        {ac.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Stack (fake) */}
            <section className="px-6 mb-5">
              <p className="text-[11px] tracking-widest uppercase text-fg-muted mb-3">
                Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {FAKE_STACK.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs bg-surface border border-border text-fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <hr className="border-border mx-6 mb-5" />

            {/* Timestamps (fake-ish) */}
            <section className="px-6 pb-8">
              <p className="text-[11px] tracking-widest uppercase text-fg-muted mb-3">
                Details
              </p>
              <dl className="flex flex-col gap-1.5 text-xs text-fg-muted">
                <div className="flex justify-between">
                  <dt>Created</dt>
                  <dd className="text-fg-subtle">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Updated</dt>
                  <dd className="text-fg-subtle">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Task ID</dt>
                  <dd className="font-mono text-fg-subtle">#{task.id}</dd>
                </div>
              </dl>
            </section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
