import { postFetcher } from "@/utils/utils";
import { CreateEpicDto, CreateEpicResponse } from "../types/projects.types";

export function createEpic(
  projectId: string,
  dto: CreateEpicDto,
): Promise<CreateEpicResponse> {
  return postFetcher<CreateEpicResponse>(`projects/${projectId}/epics`, dto);
}
