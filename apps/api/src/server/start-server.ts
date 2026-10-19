import type { Server } from "node:http";

import app from "../app";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";

export function startServer() {
  const server = app.listen(env.PORT);

  registerShutdownHandlers(server);

  return server;
}

export function registerShutdownHandlers(server: Server) {
  const gracefulShutdown = createGracefulShutdown(server);

  process.on("SIGINT", () => {
    void gracefulShutdown();
  });

  process.on("SIGTERM", () => {
    void gracefulShutdown();
  });
}

export function createGracefulShutdown(server: Server) {
  let isShuttingDown = false;

  return async () => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;

    try {
      await prisma.$disconnect();
    } finally {
      server.close(() => {
        process.exit(0);
      });
    }
  };
}
