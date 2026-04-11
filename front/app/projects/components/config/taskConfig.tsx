import { TaskPriority, TaskStatus } from "@/src/projects/types/projects.types";
import { ArrowDownToDot, ArrowUpFromDot, Minus } from "lucide-react";

export const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string }> = {
  TODO:        { label: "To Do",       bg: "bg-overlay",    text: "text-fg-muted"   },
  IN_PROGRESS: { label: "In Progress", bg: "bg-blue-950",   text: "text-blue-400"   },
  IN_REVIEW:   { label: "In Review",   bg: "bg-purple-950", text: "text-purple-400" },
  DONE:        { label: "Done",        bg: "bg-green-950",  text: "text-green-400"  },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: React.ReactNode }> = {
  HIGH:   { label: "High",   color: "text-red-400",   icon: <ArrowUpFromDot  className="w-3 h-3" /> },
  MEDIUM: { label: "Medium", color: "text-amber-400", icon: <Minus           className="w-3 h-3" /> },
  LOW:    { label: "Low",    color: "text-fg-muted",  icon: <ArrowDownToDot  className="w-3 h-3" /> },
};
