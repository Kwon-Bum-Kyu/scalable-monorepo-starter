import { z } from "zod";

export const updateExampleSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export type UpdateExampleBody = z.infer<typeof updateExampleSchema>;
