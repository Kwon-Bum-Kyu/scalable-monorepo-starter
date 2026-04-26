import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildLoggerOptions, REDACT_PATHS } from "../../../src/config/logger";

describe("buildLoggerOptions", () => {
  it("LOG_LEVEL 환경변수가 info일 때 logger.level이 info가 된다", () => {
    const options = buildLoggerOptions({ level: "info", pretty: false });

    expect(options.level).toBe("info");
  });

  it("LOG_PRETTY가 false일 때 pretty transport가 비활성된다", () => {
    const options = buildLoggerOptions({ level: "info", pretty: false });

    expect(options.transport).toBeUndefined();
  });

  it("LOG_PRETTY가 true일 때 pino-pretty transport가 설정된다", () => {
    const options = buildLoggerOptions({ level: "debug", pretty: true });

    expect(options.transport).toBeDefined();
    expect(options.transport?.target).toBe("pino-pretty");
  });

  it("redaction 키에 등록된 헤더와 body 필드가 마스킹 대상에 포함된다", () => {
    const options = buildLoggerOptions({ level: "info", pretty: false });

    const paths =
      typeof options.redact === "object" && options.redact !== null
        ? options.redact.paths
        : options.redact;

    expect(paths).toEqual(REDACT_PATHS);
    expect(paths).toContain("req.headers.authorization");
    expect(paths).toContain("req.headers.cookie");
    expect(paths).toContain("req.body.password");
    expect(paths).toContain("req.body.token");
  });
});

describe("logger 인스턴스", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("redaction 키에 등록된 authorization 헤더가 마스킹된다", async () => {
    vi.stubEnv("LOG_LEVEL", "info");
    vi.stubEnv("LOG_PRETTY", "false");

    const chunks: string[] = [];
    const { default: pino } = await import("pino");
    const { buildLoggerOptions: build } = await import(
      "../../../src/config/logger"
    );

    const stream = {
      write: (chunk: string) => {
        chunks.push(chunk);
      },
    };

    const log = pino(build({ level: "info", pretty: false }), stream);
    log.info(
      {
        req: {
          headers: { authorization: "Bearer secret-token" },
        },
      },
      "request received",
    );

    const output = chunks.join("");
    expect(output).not.toContain("Bearer secret-token");
    expect(output).toContain("[Redacted]");
  });

  it("logger 모듈은 단일 pino 인스턴스를 export 한다", async () => {
    const mod = await import("../../../src/lib/logger");

    expect(mod.logger).toBeDefined();
    expect(typeof mod.logger.info).toBe("function");
    expect(typeof mod.logger.error).toBe("function");
    expect(typeof mod.logger.warn).toBe("function");
    expect(typeof mod.logger.child).toBe("function");
  });
});
