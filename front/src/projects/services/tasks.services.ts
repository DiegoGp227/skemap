import { postFetcher } from "@/utils/utils";
import { CreateTaskDto, CreateTaskResponse } from "../types/projects.types";

export function createTask(
  epicId: number,
  dto: CreateTaskDto,
): Promise<CreateTaskResponse> {
  return postFetcher<CreateTaskResponse>(`epics/${epicId}/tasks`, dto);
}
