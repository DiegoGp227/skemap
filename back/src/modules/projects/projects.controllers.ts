import { Request, Response } from "express";
import { AppError, InternalServerError, NotFoundError } from "../../errors/appError";
import { getProjectsByUser, getProjectById } from "./projects.services";

// El middleware de auth ya verificó el token antes de llegar aquí.
// req.user está garantizado en todas estas rutas.

/**
 * @route   GET /projects
 * @headers Authorization: Bearer <token>
 * @access  Private
 * @returns { projects: Project[] }
 */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await getProjectsByUser(req.user!.id);

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
export const getProject = async (req: Request, res: Response): Promise<void> => {
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
