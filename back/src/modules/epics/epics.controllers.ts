import { Request, Response } from "express";
import { NotFoundError, ValidationError } from "../../errors/appError.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createEpicSchema } from "./epics.schemas.js";
import { createEpic as createEpicService } from "./epics.services.js";

/**
 * @route   POST /projects/:id/epics
 * @headers Authorization: Bearer <token>
 * @params  id — ID del proyecto
 * @body    { name, color, description? }
 * @access  Private
 * @returns 201 { epic }
 */
export const createEpic = asyncHandler(async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.id as string);

  if (isNaN(projectId)) {
    throw new NotFoundError("Project");
  }

  const validation = createEpicSchema.safeParse(req.body);

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

  const epic = await createEpicService(projectId, req.user!.id, validation.data);

  res.status(201).json({ epic });
});
