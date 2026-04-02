import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
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

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;
export type GetProjectsDTO = z.infer<typeof getProjectsSchema>;
