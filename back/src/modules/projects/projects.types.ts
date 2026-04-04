export interface CreateProjectInput {
  name: string;
  description?: string;
  color: string;
  technologies?: string[];
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
  status?: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  technologies?: string[];
}
