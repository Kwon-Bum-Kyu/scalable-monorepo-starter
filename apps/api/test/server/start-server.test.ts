import type { Server } from "node:http";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("startServer", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("앱을 지정된 포트로 listen하고 종료 시그널 핸들러를 등록한다", async () => {
    const handlers = new Map<string, () => void>();
    const server = createServerDouble();
    const listenMock = vi.fn(() => server);

    vi.spyOn(process, "on").mockImplementation(((event, handler) => {
      handlers.set(String(event), handler as () => void);

      return process;
    }) as typeof process.on);

    vi.doMock("../../src/app", () => ({
      default: {
        listen: listenMock,
      },
    }));
    vi.doMock("../../src/config/env", () => ({
      env: {
        PORT: 4000,
      },
    }));
    vi.doMock("../../src/lib/prisma", () => ({
      prisma: {
        $disconnect: vi.fn().mockResolvedValue(undefined),
      },
    }));

    const { startServer } = await import("../../src/server/start-server");

    expect(startServer()).toBe(server);
    expect(listenMock).toHaveBeenCalledWith(4000);
    expect(handlers.get("SIGINT")).toEqual(expect.any(Function));
    expect(handlers.get("SIGTERM")).toEqual(expect.any(Function));
  });

  it("graceful shutdown 시 prisma disconnect 후 server close와 process exit을 한 번만 호출한다", async () => {
    const server = createServerDouble();
    const disconnectMock = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(process, "exit").mockImplementation(((_code?: string | number | null) => {
      return undefined as never;
    }) as typeof process.exit);

    vi.doMock("../../src/app", () => ({
      default: {
        listen: vi.fn(() => server),
      },
    }));
    vi.doMock("../../src/config/env", () => ({
      env: {
        PORT: 4000,
      },
    }));
    vi.doMock("../../src/lib/prisma", () => ({
      prisma: {
        $disconnect: disconnectMock,
      },
    }));

    const { createGracefulShutdown } = await import("../../src/server/start-server");

    const gracefulShutdown = createGracefulShutdown(server);

    await gracefulShutdown();
    await gracefulShutdown();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
    expect(server.close).toHaveBeenCalledTimes(1);
    expect(process.exit).toHaveBeenCalledWith(0);
  });
});

function createServerDouble() {
  const close = vi.fn((callback?: () => void) => {
    callback?.();

    return server;
  });

  const server = {
    close,
  } as unknown as Server & {
    close: typeof close;
  };

  return server;
}
