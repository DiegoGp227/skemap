import { Request, Response } from "express";
import { NotFoundError, ValidationError } from "../../errors/appError.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createTaskSchema } from "./tasks.schemas.js";
import { createTask as createTaskService } from "./tasks.services.js";

/**
 * @route   POST /epics/:id/tasks
 * @headers Authorization: Bearer <token>
 * @params  id — ID del epic
 * @body    { title, description?, priority?, technologies?, dueDate?, acceptanceCriteria? }
 * @access  Private
 * @returns 201 { task }
 */
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const epicId = parseInt(req.params.id as string);

  if (isNaN(epicId)) {
    throw new NotFoundError("Epic");
  }

  const validation = createTaskSchema.safeParse(req.body);

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

  const task = await createTaskService(epicId, req.user!.id, validation.data);

  res.status(201).json({ task });
});
