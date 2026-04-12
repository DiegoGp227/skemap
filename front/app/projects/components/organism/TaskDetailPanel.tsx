"use client";

import { Task, TaskStatus } from "@/src/projects/types/projects.types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../config/taskConfig";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";
import ActionsButtons from "../molecules/ActionsButtons";
import ModalDelete from "../atoms/ModalDelete";
import useDeleteTask from "@/src/projects/hooks/useDeleteTask";
import { useBoardContext } from "../../context/ProjectBoardContext";

interface TaskDetailPanelProps {
  task: Task | null;
  epicColor?: string;
  epicName?: string;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  onClose: () => void;
}

export function TaskDetailPanel({ task, epicColor, epicName, onStatusChange, onClose }: TaskDetailPanelProps) {
  const { projectId } = useBoardContext();
  const status = task ? STATUS_CONFIG[task.status] : null;
  const priority = task ? PRIORITY_CONFIG[task.priority] : null;
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { loading: deleteLoading, handleDeleteTask } = useDeleteTask(task?.id ?? 0, projectId);

  return (
    <>
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
            className="fixed top-0 right-0 h-full w-95 z-50 flex flex-col bg-base border-l border-border overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div
                className="text-xs font-bold"
                style={{ color: epicColor ?? "#7d8590" }}
              >
                {epicName ?? "Epic"} · #{task.id}
              </div>
              <div className="flex items-center gap-2">
                <ActionsButtons
                  compact
                  onEdit={() => setShowEditForm(true)}
                  onDelete={() => setShowDeleteModal(true)}
                />
                <button
                  onClick={onClose}
                  className="text-fg-muted hover:text-fg transition-colors duration-150 -mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h2 className="px-6 font-bold text-fg leading-snug mb-4">
              {task.title}
            </h2>

            {/* Meta badges */}
            <div className="px-6 flex flex-wrap gap-2 mb-5">
              {status && (
                <span
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${status.bg} ${status.text}`}
                >
                  {status.label}
                </span>
              )}
              {priority && (
                <span
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-overlay ${priority.color}`}
                >
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
                {task.description}
              </p>
            </section>

            {/* Acceptance criteria */}
            {task.acceptanceCriteria?.length > 0 && (
              <section className="px-6 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] tracking-widest uppercase text-fg-muted">
                    Acceptance criteria
                  </p>
                  <span className="text-[11px] text-fg-muted">
                    {task.acceptanceCriteria.filter((ac) => ac.done).length}/{task.acceptanceCriteria.length}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {task.acceptanceCriteria.map((ac) => (
                    <li key={ac.id} className="flex items-center gap-2.5">
                      {/* TODO: toggle acceptance criteria done */}
                      <button className="shrink-0 w-1.5 h-1.5 rounded-full border border-red-500/60 cursor-not-allowed"
                        style={ac.done ? { backgroundColor: epicColor } : undefined}
                        title="TODO: toggle AC"
                      />
                      <span className={`text-sm leading-snug flex-1 ${ac.done ? "line-through text-fg-muted" : "text-fg-subtle"}`}>
                        {ac.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {task.technologies.length > 0 && (
              <section className="px-6 mb-5">
                <p className="text-[11px] tracking-widest uppercase text-fg-muted mb-3">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {task.technologies.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs bg-surface border border-border text-fg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Status selector */}
            <section className="px-6 mb-5">
              <p className="text-[11px] tracking-widest uppercase text-fg-muted mb-3">
                Change status
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(STATUS_CONFIG) as [TaskStatus, typeof STATUS_CONFIG[TaskStatus]][]).map(([key, cfg]) => {
                  const isActive = task.status === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onStatusChange(task.id, key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer
                        ${isActive
                          ? `${cfg.bg} ${cfg.text} border-transparent`
                          : "bg-transparent border-border text-fg-muted hover:border-ring hover:text-fg"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? cfg.text.replace("text-", "bg-") : "bg-fg-muted"}`} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <hr className="border-border mx-6 mb-5" />

            {/* Details */}
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

    {showEditForm && task && (
      <EditTaskForm
        task={task}
        onClose={() => setShowEditForm(false)}
      />
    )}

    {showDeleteModal && task && (
      <ModalDelete
        title="Delete task"
        description="This action cannot be undone. The task and all its acceptance criteria will be permanently deleted."
        onConfirm={async () => {
          const success = await handleDeleteTask();
          if (success) { setShowDeleteModal(false); onClose(); }
        }}
        onClose={() => setShowDeleteModal(false)}
        loading={deleteLoading}
      />
    )}
  </>
  );
}
