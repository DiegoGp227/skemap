import { Request, Response } from "express";
import {
  AppError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../errors/appError.js";
import { createEpicSchema } from "./epics.shemas.js";
import { createEpic as createEpicService } from "./epics.services.js";

/**
 * @route   POST /projects/:id/epics
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @body    { name, color, description? }
 * @access  Private
 * @returns 201 { epic }
 */
export const createEpic = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = parseInt(req.params.id as string);

    if (isNaN(projectId)) {
      throw new NotFoundError("Project");
    }

    const validation = createEpicSchema.safeParse(req.body);

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

    const epic = await createEpicService(projectId, req.user!.id, validation.data);

    res.status(201).json({ epic });
  } catch (error) {
    console.error("❌ Error in createEpic:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};
