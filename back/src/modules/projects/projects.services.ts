import { ProjectStatus, TaskStatus } from "@prisma/client";
import prisma from "../../db/prisma.js";
import { ConflictError, NotFoundError } from "../../errors/appError.js";
import { CreateProjectInput, UpdateProjectInput } from "./projects.types.js";

type TaskStats = { project_id: number; tasks_total: bigint; tasks_done: bigint };

// prisma.$queryRaw devuelve bigint para COUNT — los convertimos a number antes de retornar
const normalizeStats = (stats: TaskStats[]) =>
  stats.map((s) => ({
    projectId: s.project_id,
    tasksTotal: Number(s.tasks_total),
    tasksDone: Number(s.tasks_done),
  }));

export const getProjectsByUser = async (
  userId: number,
  status?: ProjectStatus,
  search?: string,
) => {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
      ...(status && { status }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
      technologies: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { epics: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);

  const rawStats = await prisma.$queryRaw<TaskStats[]>`
    SELECT
      e."projectId"                                        AS project_id,
      COUNT(t.id)                                          AS tasks_total,
      COUNT(t.id) FILTER (WHERE t.status = 'DONE')         AS tasks_done
    FROM "Epic" e
    LEFT JOIN "Task" t ON t."epicId" = e.id
    WHERE e."projectId" = ANY(${projectIds}::int[])
    GROUP BY e."projectId"
  `;

  const statsMap = new Map(normalizeStats(rawStats).map((s) => [s.projectId, s]));

  return projects.map((project) => {
    const stats = statsMap.get(project.id);
    return {
      ...project,
      tasksTotal: stats?.tasksTotal ?? 0,
      tasksDone: stats?.tasksDone ?? 0,
    };
  });
};

export const getProjectById = async (projectId: number, userId: number) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
      technologies: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { epics: true } },
    },
  });

  if (!project || project.ownerId !== userId) return null;

  const rawStats = await prisma.$queryRaw<TaskStats[]>`
    SELECT
      e."projectId"                                        AS project_id,
      COUNT(t.id)                                          AS tasks_total,
      COUNT(t.id) FILTER (WHERE t.status = 'DONE')         AS tasks_done
    FROM "Epic" e
    LEFT JOIN "Task" t ON t."epicId" = e.id
    WHERE e."projectId" = ${projectId}
    GROUP BY e."projectId"
  `;

  const stats = normalizeStats(rawStats)[0];

  return {
    ...project,
    tasksTotal: stats?.tasksTotal ?? 0,
    tasksDone: stats?.tasksDone ?? 0,
  };
};

export const createProject = async (
  data: CreateProjectInput,
  ownerId: number,
) => {
  const existing = await prisma.project.findUnique({
    where: { ownerId_name: { ownerId, name: data.name } },
  });

  if (existing) {
    throw new ConflictError(`A project named "${data.name}" already exists`);
  }

  const project = await prisma.project.create({
    data: { ...data, ownerId },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
      technologies: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return project;
};

export const updateProject = async (
  projectId: number,
  userId: number,
  data: UpdateProjectInput,
) => {
  const existing = await getProjectById(projectId, userId);

  if (!existing) {
    throw new NotFoundError("Project");
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      status: true,
      technologies: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return project;
};

export const deleteProject = async (projectId: number, userId: number) => {
  const existing = await getProjectById(projectId, userId);

  if (!existing) {
    throw new NotFoundError("Project");
  }

  await prisma.project.delete({ where: { id: projectId } });
};

export const getProjectBoard = async (
  projectId: number,
  userId: number,
  statusFilter?: TaskStatus[],
) => {
  const [project, epicTotals, epicDone] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      include: {
        epics: {
          orderBy: { order: "asc" },
          include: {
            tasks: {
              where: statusFilter ? { status: { in: statusFilter } } : undefined,
              orderBy: { order: "asc" },
            },
          },
        },
      },
    }),
    prisma.task.groupBy({ by: ["epicId"], where: { epic: { projectId } }, _count: { id: true } }),
    prisma.task.groupBy({ by: ["epicId"], where: { epic: { projectId }, status: "DONE" }, _count: { id: true } }),
  ]);

  if (!project || project.ownerId !== userId) return null;

  const totalsMap = Object.fromEntries(epicTotals.map((r) => [r.epicId, r._count.id]));
  const doneMap = Object.fromEntries(epicDone.map((r) => [r.epicId, r._count.id]));

  const tasksTotal = epicTotals.reduce((acc, r) => acc + r._count.id, 0);
  const tasksDone  = epicDone.reduce((acc, r) => acc + r._count.id, 0);

  const { epics, ...projectData } = project;
  const epicsWithProgress = epics.map((epic) => ({
    ...epic,
    tasksTotal: totalsMap[epic.id] ?? 0,
    tasksDone: doneMap[epic.id] ?? 0,
  }));

  return { project: { ...projectData, tasksTotal, tasksDone }, epics: epicsWithProgress };
};

/**
 * Devuelve el conteo de proyectos del usuario agrupado por estado.
 * Usa groupBy de Prisma — una sola query, sin SQL raw.
 * Si un estado no tiene proyectos no aparece en rows → default 0.
 */
export const getProjectsStatsByUser = async (userId: number) => {
  const rows = await prisma.project.groupBy({
    by: ["status"],
    where: { ownerId: userId },
    _count: { id: true },
  });

  const find = (s: ProjectStatus) => rows.find((r) => r.status === s)?._count.id ?? 0;

  return {
    active:    find(ProjectStatus.ACTIVE),
    completed: find(ProjectStatus.COMPLETED),
    archived:  find(ProjectStatus.ARCHIVED),
  };
};
