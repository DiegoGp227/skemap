import { Request, Response } from "express";
import { NotFoundError, ValidationError } from "../../errors/appError.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ProjectStatus } from "@prisma/client";
import {
  getProjectsByUser,
  getProjectById,
  getProjectsStatsByUser,
  getProjectBoard as getProjectBoardService,
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  updateTaskStatus as updateTaskStatusService,
} from "./projects.services.js";
import {
  createProjectSchema,
  getProjectBoardSchema,
  getProjectsSchema,
  updateProjectSchema,
  updateTaskStatusSchema,
} from "./projects.schema.js";

// Traduce el string del frontend al enum de Prisma.
const STATUS_MAP: Record<string, ProjectStatus> = {
  active: ProjectStatus.ACTIVE,
  complete: ProjectStatus.COMPLETED,
  filed: ProjectStatus.ARCHIVED,
};

/**
 * @route   GET /projects
 * @headers Authorization: Bearer <token>
 * @access  Private
 * @returns { projects: Project[] }
 */
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const validation = getProjectsSchema.safeParse(req.query);

  if (!validation.success) {
    const errors = validation.error.issues.reduce<Record<string, string>>(
      (acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      },
      {},
    );
    throw new ValidationError("Invalid query params", errors);
  }

  const { status, search } = validation.data;
  const prismaStatus = status && status !== "all" ? STATUS_MAP[status] : undefined;
  const projects = await getProjectsByUser(req.user!.id, prismaStatus, search);

  res.status(200).json({ projects });
});

/**
 * @route   GET /projects/:id
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @access  Private
 * @returns { project }
 */
export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id as string);

  if (isNaN(projectId)) {
    throw new NotFoundError("Project");
  }

  const project = await getProjectById(projectId, req.user!.id);

  if (!project) {
    throw new NotFoundError("Project");
  }

  res.status(200).json({ project });
});

/**
 * @route   POST /projects
 * @headers Authorization: Bearer <token>
 * @body    { name, color, description? }
 * @access  Private
 * @returns { project }
 */
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const validation = createProjectSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = validation.error.issues.reduce<Record<string, string>>(
      (acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      },
      {},
    );
    throw new ValidationError("Validation errors", errors);
  }

  const project = await createProjectService(validation.data, req.user!.id);

  res.status(201).json({ project });
});

/**
 * @route   PATCH /projects/:id
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @body    { name?, color?, description?, status? }
 * @access  Private
 * @returns { project }
 */
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id as string);

  if (isNaN(projectId)) {
    throw new NotFoundError("Project");
  }

  const validation = updateProjectSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = validation.error.issues.reduce<Record<string, string>>(
      (acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      },
      {},
    );
    throw new ValidationError("Validation errors", errors);
  }

  const project = await updateProjectService(projectId, req.user!.id, validation.data);

  res.status(200).json({ project });
});

/**
 * @route   DELETE /projects/:id
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @access  Private
 * @returns 204 No Content
 */
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id as string);

  if (isNaN(projectId)) {
    throw new NotFoundError("Project");
  }

  await deleteProjectService(projectId, req.user!.id);

  res.status(204).send();
});

/**
 * @route   GET /projects/:id/board
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @query   status? — uno o varios: TODO | IN_PROGRESS | IN_REVIEW | DONE
 * @access  Private
 * @returns { project, epics: Epic[] }
 */
export const getProjectBoard = asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id as string);

  if (isNaN(projectId)) {
    throw new NotFoundError("Project");
  }

  const validation = getProjectBoardSchema.safeParse(req.query);

  if (!validation.success) {
    const errors = validation.error.issues.reduce<Record<string, string>>(
      (acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      },
      {},
    );
    throw new ValidationError("Invalid query params", errors);
  }

  const board = await getProjectBoardService(projectId, req.user!.id, validation.data.status);

  if (!board) {
    throw new NotFoundError("Project");
  }

  res.status(200).json(board);
});

/**
 * @route   PATCH /tasks/:id/status
 * @headers Authorization: Bearer <token>
 * @params  id — ID de la tarea
 * @body    { status: TaskStatus }
 * @access  Private
 * @returns { task }
 */
export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id as string);

  if (isNaN(taskId)) {
    throw new NotFoundError("Task");
  }

  const validation = updateTaskStatusSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = validation.error.issues.reduce<Record<string, string>>(
      (acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      },
      {},
    );
    throw new ValidationError("Validation errors", errors);
  }

  const task = await updateTaskStatusService(taskId, req.user!.id, validation.data.status);

  res.status(200).json({ task });
});

/**
 * @route   GET /projects/stats
 * @headers Authorization: Bearer <token>
 * @access  Private
 * @returns { stats: { active: number, completed: number, archived: number } }
 */
export const getProjectsStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getProjectsStatsByUser(req.user!.id);
  res.status(200).json({ stats });
});
