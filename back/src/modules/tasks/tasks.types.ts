export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  technologies?: string[];
  dueDate?: string;
  acceptanceCriteria?: string[];
}
