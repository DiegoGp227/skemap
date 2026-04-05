import { projectBoardURL } from "@/src/shared/constants/urls";
import { fetcher } from "@/utils/utils";
import { TaskStatus, ProjectBoardResponse } from "../types/projects.types";

export function getProjectBoard(
  id: string,
  statuses: TaskStatus[]
): Promise<ProjectBoardResponse> {
  const url = projectBoardURL(id);
  statuses.forEach((s) => url.searchParams.append("status", s));
  return fetcher<ProjectBoardResponse>(url.toString());
}
