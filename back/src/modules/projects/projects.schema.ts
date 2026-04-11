import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  technologies: z.array(z.string().min(1).max(50)).max(20).optional().default([]),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
});

// Query params del GET /projects
export const getProjectsSchema = z.object({
  // Los valores que el frontend puede enviar como status
  status: z.enum(["all", "active", "complete", "filed"]).optional(),
  search: z.string().optional(),
});

const taskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);

// Query params del GET /projects/:id/board
export const getProjectBoardSchema = z.object({
  status: z
    .union([taskStatusEnum, z.array(taskStatusEnum)])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
});

// Body del PATCH /tasks/:id/status
export const updateTaskStatusSchema = z.object({
  status: taskStatusEnum,
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;
export type GetProjectsDTO = z.infer<typeof getProjectsSchema>;
export type GetProjectBoardDTO = z.infer<typeof getProjectBoardSchema>;
export type UpdateTaskStatusDTO = z.infer<typeof updateTaskStatusSchema>;
