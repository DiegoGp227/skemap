import useSWR from "swr";
import { getProjectBoard } from "../services/projectBoard.service";
import { TaskStatus, ProjectBoardResponse } from "../types/projects.types";

export default function useProjectBoard(id: string, statuses: TaskStatus[]) {
  const key = statuses.length
    ? `project-board-${id}-${statuses.join(",")}`
    : `project-board-${id}`;

  const { data, isLoading, error } = useSWR<ProjectBoardResponse>(key, () =>
    getProjectBoard(id, statuses)
  );

  return {
    project: data?.project ?? null,
    epics: data?.epics ?? [],
    loading: isLoading,
    error: error ? "Error loading project board" : null,
  };
}
