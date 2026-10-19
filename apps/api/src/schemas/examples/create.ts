import { z } from "zod";

export const createExampleSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export type CreateExampleBody = z.infer<typeof createExampleSchema>;
