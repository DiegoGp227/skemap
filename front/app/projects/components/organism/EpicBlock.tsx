"use client";

import { TaskRow } from "../molecules/TaskRow";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Epic, Task } from "@/src/projects/types/projects.types";
import NewTaskForm from "./NewTaskForm";
import { useBoardContext } from "../../context/ProjectBoardContext";
import ActionsButtons from "../molecules/ActionsButtons";

interface EpicBlockProps {
  epic: Epic;
  onTaskSelect: (task: Task) => void;
  selectedTaskId: number | null;
}

export function EpicBlock({
  epic,
  onTaskSelect,
  selectedTaskId,
}: EpicBlockProps) {
  const { projectId, technologies, onTaskStatusChange } = useBoardContext();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      <div
        className="w-200 flex items-center gap-2 bg-surface border rounded-lg transition-colors duration-200"
        style={{
          borderLeftWidth: 3,
          borderLeftColor: epic.color,
          borderTopColor: hovered ? epic.color : "transparent",
          borderRightColor: hovered ? epic.color : "transparent",
          borderBottomColor: hovered ? epic.color : "transparent",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-center gap-3 px-4 py-3 transition duration-200 text-left"
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
              <span className="text-sm font-semibold text-fg truncate">
                {epic.name}
              </span>
            </div>
            {epic.description && (
              <p className="text-xs text-fg-muted mt-0.5 truncate">
                {epic.description}
              </p>
            )}
          </div>
          <span className="text-xs text-fg-muted shrink-0">
            {epic.tasksDone}/{epic.tasksTotal} tasks
          </span>
        </button>

        <ActionsButtons onDelete={() => {}} onEdit={() => {}} compact />
      </div>

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
                <p className="text-xs text-fg-muted italic px-4 py-2">
                  No tasks
                </p>
              ) : (
                epic.tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    selected={selectedTaskId === task.id}
                    onStatusChange={() =>
                      onTaskStatusChange(task.id, task.status)
                    }
                    onSelect={() => onTaskSelect(task)}
                  />
                ))
              )}
            </div>
            <div className="flex flex-col gap-1.5 pl-4 pt-2 pb-1">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-end px-3 border rounded cursor-pointer border-border text-fg-muted hover:bg-surface hover:text-fg transition duration-500 w-fit"
              >
                New Task
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && (
        <NewTaskForm
          epicId={epic.id}
          projectId={projectId}
          technologies={technologies}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
