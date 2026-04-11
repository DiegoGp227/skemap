import { z } from "zod";

const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: taskPriorityEnum.optional().default("LOW"),
  technologies: z.array(z.string().min(1).max(50)).max(20).optional().default([]),
  dueDate: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(Date.parse(v)), { message: "Invalid date format" }),
  acceptanceCriteria: z.array(z.string().min(1).max(500)).max(20).optional().default([]),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
