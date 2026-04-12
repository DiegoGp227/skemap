import { z } from "zod";

export const createEpicSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export type CreateEpicDTO = z.infer<typeof createEpicSchema>;

export const updateEpicSchema = createEpicSchema.partial();

export type UpdateEpicDTO = z.infer<typeof updateEpicSchema>;
