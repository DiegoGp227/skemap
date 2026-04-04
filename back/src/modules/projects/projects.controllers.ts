import { Request, Response } from "express";
import {
  AppError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../errors/appError";
import { ProjectStatus } from "@prisma/client";
import {
  getProjectsByUser,
  getProjectById,
  getProjectsStatsByUser,
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "./projects.services";
import { createProjectSchema, getProjectsSchema, updateProjectSchema } from "./projects.shema";

// El middleware de auth ya verificó el token antes de llegar aquí.
// req.user está garantizado en todas estas rutas.

/**
 * @route   GET /projects
 * @headers Authorization: Bearer <token>
 * @access  Private
 * @returns { projects: Project[] }
 */
// Traduce el string del frontend al enum de Prisma.
// El controller es el responsable de esta conversión, no el servicio.
const STATUS_MAP: Record<string, ProjectStatus> = {
  active: ProjectStatus.ACTIVE,
  complete: ProjectStatus.COMPLETED,
  filed: ProjectStatus.ARCHIVED,
};

export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Validamos los query params con Zod igual que hacemos con el body.
    // req.query contiene los params de la URL: /projects?status=active&search=foo
    const validation = getProjectsSchema.safeParse(req.query);

    if (!validation.success) {
      const errors = validation.error.issues.reduce(
        (acc: Record<string, string>, err) => {
          acc[err.path.join(".")] = err.message;
          return acc;
        },
        {},
      );
      throw new ValidationError("Invalid query params", errors);
    }

    const { status, search } = validation.data;

    // Si status es "all" o no viene, pasamos undefined → el servicio no filtra.
    // Si tiene valor lo traducimos al enum antes de pasarlo al servicio.
    const prismaStatus = status && status !== "all" ? STATUS_MAP[status] : undefined;

    const projects = await getProjectsByUser(req.user!.id, prismaStatus, search);

    res.status(200).json({ projects });
  } catch (error) {
    console.error("❌ Error in getProjects:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};

/**
 * @route   GET /projects/:id
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @access  Private
 * @returns { project }
 */
export const getProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = parseInt(req.params.id as string);

    if (isNaN(projectId)) {
      throw new NotFoundError("Project");
    }

    const project = await getProjectById(projectId, req.user!.id);

    if (!project) {
      throw new NotFoundError("Project");
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("❌ Error in getProject:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};

/**
 * @route   POST /projects
 * @headers Authorization: Bearer <token>
 * @body    { name, color, description? }
 * @access  Private
 * @returns { project }
 */

export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validation = createProjectSchema.safeParse(req.body);

    if (!validation.success) {
      const errors = validation.error.issues.reduce(
        (acc: Record<string, string>, err) => {
          acc[err.path.join(".")] = err.message;
          return acc;
        },
        {},
      );
      throw new ValidationError("Validation errors", errors);
    }

    const project = await createProjectService(validation.data, req.user!.id);

    res.status(201).json({ project });
  } catch (error) {
    console.error("❌ Error in createProject:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};

/**
 * @route   PATCH /projects/:id
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @body    { name?, color?, description?, status? }
 * @access  Private
 * @returns { project }
 */

export const updateProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = parseInt(req.params.id as string);

    if (isNaN(projectId)) {
      throw new NotFoundError("Project");
    }

    const validation = updateProjectSchema.safeParse(req.body);

    if (!validation.success) {
      const errors = validation.error.issues.reduce(
        (acc: Record<string, string>, err) => {
          acc[err.path.join(".")] = err.message;
          return acc;
        },
        {},
      );
      throw new ValidationError("Validation errors", errors);
    }

    const project = await updateProjectService(
      projectId,
      req.user!.id,
      validation.data,
    );

    res.status(200).json({ project });
  } catch (error) {
    console.error("❌ Error in updateProject:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};

/**
 * @route   DELETE /projects/:id
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @access  Private
 * @returns 204 No Content
 */
export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectId = parseInt(req.params.id as string);

    if (isNaN(projectId)) {
      throw new NotFoundError("Project");
    }

    await deleteProjectService(projectId, req.user!.id);

    res.status(204).send();
  } catch (error) {
    console.error("❌ Error in deleteProject:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};

/**
 * @route   GET /projects/stats
 * @headers Authorization: Bearer <token>
 * @access  Private
 * @returns { stats: { active: number, completed: number, archived: number } }
 */
export const getProjectsStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stats = await getProjectsStatsByUser(req.user!.id);
    res.status(200).json({ stats });
  } catch (error) {
    console.error("❌ Error in getProjectsStats:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};
