import type { IncomingMessage, ServerResponse } from "http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Headers = Record<string, string | number | string[]>;

const runMiddleware = async (
  middleware: (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: unknown) => void,
  ) => void,
): Promise<Headers> => {
  const headers: Headers = {};
  const req = {} as IncomingMessage;
  const res = {
    setHeader(name: string, value: string | number | string[]) {
      headers[name.toLowerCase()] = value;
    },
    getHeader(name: string) {
      return headers[name.toLowerCase()];
    },
    removeHeader(name: string) {
      delete headers[name.toLowerCase()];
    },
  } as unknown as ServerResponse;

  await new Promise<void>((resolve, reject) => {
    middleware(req, res, (err) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }
      resolve();
    });
  });

  return headers;
};

describe("createHelmetMiddleware", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  const load = async () => {
    const mod = await import(
      "../../../src/middlewares/helmet"
    );
    return mod.createHelmetMiddleware as () => (
      req: IncomingMessage,
      res: ServerResponse,
      next: (err?: unknown) => void,
    ) => void;
  };

  it("NODE_ENV가 production일 때 Strict-Transport-Security 헤더가 부여된다", async () => {
    process.env.NODE_ENV = "production";
    const factory = await load();
    const headers = await runMiddleware(factory());
    expect(headers["strict-transport-security"]).toBeDefined();
  });

  it("NODE_ENV가 development일 때 Strict-Transport-Security 헤더가 비활성된다", async () => {
    process.env.NODE_ENV = "development";
    const factory = await load();
    const headers = await runMiddleware(factory());
    expect(headers["strict-transport-security"]).toBeUndefined();
  });

  it("X-Frame-Options와 X-Content-Type-Options 헤더가 부여된다", async () => {
    process.env.NODE_ENV = "development";
    const factory = await load();
    const headers = await runMiddleware(factory());
    expect(headers["x-frame-options"]).toBeDefined();
    expect(headers["x-content-type-options"]).toBe("nosniff");
  });

  it("API 서버 특성상 Content-Security-Policy 헤더는 비활성된다", async () => {
    process.env.NODE_ENV = "production";
    const factory = await load();
    const headers = await runMiddleware(factory());
    expect(headers["content-security-policy"]).toBeUndefined();
  });
});
