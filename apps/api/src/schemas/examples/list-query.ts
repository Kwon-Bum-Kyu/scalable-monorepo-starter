import { z } from "zod";

export const listExamplesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["draft", "published"]).optional(),
});

export type ListExamplesQuery = z.infer<typeof listExamplesQuerySchema>;
