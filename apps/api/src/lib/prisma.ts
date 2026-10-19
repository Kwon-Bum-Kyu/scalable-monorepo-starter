import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "../config/env";

function createPrismaClient(): PrismaClient {
  const connectionString = env.DATABASE_URL;
  const useNeonAdapter =
    env.NODE_ENV === "production" || env.NODE_ENV === "staging";

  const adapter = useNeonAdapter
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
