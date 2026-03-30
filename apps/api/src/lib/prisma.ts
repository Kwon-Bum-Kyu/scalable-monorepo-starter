import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "../config/env";

function createPrismaClient(): PrismaClient {
  const connectionString = env.DATABASE_URL;
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
