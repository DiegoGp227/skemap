export interface CreateEpicInput {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateEpicInput {
  name?: string;
  description?: string;
  color?: string;
}
