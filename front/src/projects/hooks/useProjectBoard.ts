import useSWR from "swr";
import { getProjectBoard, updateTaskStatus as updateTaskStatusService } from "../services/projectBoard.service";
import { TaskStatus, ProjectBoardResponse } from "../types/projects.types";

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "IN_REVIEW",
  IN_REVIEW: "DONE",
  DONE: "TODO",
};

export default function useProjectBoard(id: string, statuses: TaskStatus[]) {
  const key = statuses.length
    ? `project-board-${id}-${statuses.join(",")}`
    : `project-board-${id}`;

  const { data, isLoading, error, mutate } = useSWR<ProjectBoardResponse>(key, () =>
    getProjectBoard(id, statuses)
  );

  const advanceTaskStatus = async (taskId: number, currentStatus: TaskStatus) => {
    const nextStatus = NEXT_STATUS[currentStatus];

    await mutate(
      (prev: ProjectBoardResponse | undefined) => {
        if (!prev) return prev;

        const goingToDone = nextStatus === "DONE";
        const comingFromDone = currentStatus === "DONE";
        const doneDelta = goingToDone ? 1 : comingFromDone ? -1 : 0;

        const updatedEpics = prev.epics.map((epic) => {
          const hasTask = epic.tasks.some((t) => t.id === taskId);
          if (!hasTask) return epic;

          return {
            ...epic,
            tasksDone: epic.tasksDone + doneDelta,
            tasks: epic.tasks.map((t) =>
              t.id === taskId ? { ...t, status: nextStatus } : t
            ),
          };
        });

        return {
          ...prev,
          project: {
            ...prev.project,
            tasksDone: prev.project.tasksDone + doneDelta,
          },
          epics: updatedEpics,
        };
      },
      { revalidate: false }
    );

    try {
      await updateTaskStatusService(taskId, nextStatus);
    } catch {
      mutate();
    }
  };

  return {
    project: data?.project ?? null,
    epics: data?.epics ?? [],
    loading: isLoading,
    error: error ? "Error loading project board" : null,
    advanceTaskStatus,
  };
}
