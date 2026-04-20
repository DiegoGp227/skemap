"use client";

import {
  BoardProject,
  Epic,
  TaskStatus,
} from "@/src/projects/types/projects.types";
import FilterProject from "../molecules/FilterProject";
import InfoProject from "../molecules/InfoProject";
import EpicSection from "./EpicSection";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface LateralBarProps {
  taskStatus: TaskStatus[];
  setTaskStatus: React.Dispatch<React.SetStateAction<TaskStatus[]>>;
  project: BoardProject;
  epics: Epic[];
  isOpen: boolean;
  onClose: () => void;
}

export default function LateralBar({
  taskStatus,
  setTaskStatus,
  project,
  epics,
  isOpen,
  onClose,
}: LateralBarProps) {
  const content = (
    <>
      <InfoProject
        title={project.name}
        technologies={project.technologies}
        color={project.color}
        current={project.tasksDone}
        total={project.tasksTotal}
      />
      <FilterProject taskStatus={taskStatus} setTaskStatus={setTaskStatus} />
      <EpicSection epics={epics} projectId={project.id.toString()} />
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <section className="hidden md:block h-full max-w-72 shrink-0">
        {content}
      </section>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              key="sidebar-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 left-0 h-full w-72 z-50 bg-base border-r border-border overflow-y-auto md:hidden"
            >
              <div className="flex justify-end p-3">
                <button
                  onClick={onClose}
                  className="text-fg-muted hover:text-fg transition-colors duration-150"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
