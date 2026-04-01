export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type ProjectColor = string; // hex color, e.g. "#ff5733"

export interface Project {
  id: number;
  name: string;
  description?: string;
  color: ProjectColor;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
}
