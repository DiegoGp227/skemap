export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface AcceptanceCriteria {
  id: number;
  text: string;
  done: boolean;
  order: number;
  taskId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  dueDate: string | null;
  epicId: number;
  createdAt: string;
  updatedAt: string;
  acceptanceCriteria: AcceptanceCriteria[];
}

export interface Epic {
  id: number;
  name: string;
  description: string | null;
  color: string;
  order: number;
  projectId: number;
  tasksTotal: number;
  tasksDone: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

export interface BoardProject {
  id: number;
  name: string;
  description: string | null;
  color: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  technologies: string[];
  ownerId: number;
  tasksTotal: number;
  tasksDone: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectBoardResponse {
  project: BoardProject;
  epics: Epic[];
}
