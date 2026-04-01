export interface CreateProjectInput {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
  status?: "ACTIVE" | "COMPLETED" | "ARCHIVED";
}
