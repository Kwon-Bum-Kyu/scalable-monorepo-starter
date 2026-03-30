import { z } from "zod";

export const systemInfoQuerySchema = z.object({
  format: z.enum(["summary", "full"]).default("summary"),
});

export type SystemInfoQuery = z.infer<typeof systemInfoQuerySchema>;
