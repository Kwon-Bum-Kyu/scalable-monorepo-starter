import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type LoadedEnv = {
  NODE_ENV: string;
  LOG_LEVEL: string;
  LOG_PRETTY: boolean;
  CORS_ALLOWED_ORIGINS: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  ENABLE_EXAMPLES: boolean;
  HEALTH_DB_TIMEOUT_MS: number;
};

const RESERVED_KEYS = [
  "LOG_LEVEL",
  "LOG_PRETTY",
  "CORS_ALLOWED_ORIGINS",
  "RATE_LIMIT_WINDOW_MS",
  "RATE_LIMIT_MAX",
  "ENABLE_EXAMPLES",
  "HEALTH_DB_TIMEOUT_MS",
] as const;

describe("config/env", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const original: Partial<Record<(typeof RESERVED_KEYS)[number], string>> = {};

  beforeEach(() => {
    for (const key of RESERVED_KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
    process.env.DATABASE_URL =
      originalDatabaseUrl ?? "postgresql://test:test@localhost:5432/test";
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
    for (const key of RESERVED_KEYS) {
      const value = original[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  const load = async (): Promise<LoadedEnv> => {
    const mod = await import("../../../src/config/env");
    return mod.env as unknown as LoadedEnv;
  };

  it("LOG_LEVEL 미설정이면 NODE_ENV development에서 debug default를 가진다", async () => {
    process.env.NODE_ENV = "development";
    const env = await load();
    expect(env.LOG_LEVEL).toBe("debug");
  });

  it("LOG_LEVEL 미설정이면 NODE_ENV production에서 info default를 가진다", async () => {
    process.env.NODE_ENV = "production";
    const env = await load();
    expect(env.LOG_LEVEL).toBe("info");
  });

  it("LOG_PRETTY 미설정이면 NODE_ENV development에서 true를 default로 가진다", async () => {
    process.env.NODE_ENV = "development";
    const env = await load();
    expect(env.LOG_PRETTY).toBe(true);
  });

  it("LOG_PRETTY 미설정이면 NODE_ENV production에서 false를 default로 가진다", async () => {
    process.env.NODE_ENV = "production";
    const env = await load();
    expect(env.LOG_PRETTY).toBe(false);
  });

  it("CORS_ALLOWED_ORIGINS 미설정이면 http://localhost:3000 단일 origin을 default로 노출한다", async () => {
    process.env.NODE_ENV = "development";
    const env = await load();
    expect(env.CORS_ALLOWED_ORIGINS).toBe("http://localhost:3000");
  });

  it("RATE_LIMIT_WINDOW_MS 미설정이면 60000으로 파싱된다", async () => {
    process.env.NODE_ENV = "development";
    const env = await load();
    expect(env.RATE_LIMIT_WINDOW_MS).toBe(60000);
  });

  it("RATE_LIMIT_MAX 미설정이면 100으로 파싱된다", async () => {
    process.env.NODE_ENV = "development";
    const env = await load();
    expect(env.RATE_LIMIT_MAX).toBe(100);
  });

  it("HEALTH_DB_TIMEOUT_MS 미설정이면 2000으로 파싱된다", async () => {
    process.env.NODE_ENV = "development";
    const env = await load();
    expect(env.HEALTH_DB_TIMEOUT_MS).toBe(2000);
  });

  it("RATE_LIMIT_WINDOW_MS·MAX·HEALTH_DB_TIMEOUT_MS 환경변수 값이 정수로 파싱된다", async () => {
    process.env.NODE_ENV = "development";
    process.env.RATE_LIMIT_WINDOW_MS = "30000";
    process.env.RATE_LIMIT_MAX = "200";
    process.env.HEALTH_DB_TIMEOUT_MS = "1500";
    const env = await load();
    expect(env.RATE_LIMIT_WINDOW_MS).toBe(30000);
    expect(env.RATE_LIMIT_MAX).toBe(200);
    expect(env.HEALTH_DB_TIMEOUT_MS).toBe(1500);
  });

  it("ENABLE_EXAMPLES가 \"false\"일 때 boolean false로 변환된다", async () => {
    process.env.NODE_ENV = "development";
    process.env.ENABLE_EXAMPLES = "false";
    const env = await load();
    expect(env.ENABLE_EXAMPLES).toBe(false);
  });

  it("ENABLE_EXAMPLES 미설정이면 NODE_ENV development에서 true를 default로 가진다", async () => {
    process.env.NODE_ENV = "development";
    const env = await load();
    expect(env.ENABLE_EXAMPLES).toBe(true);
  });

  it("ENABLE_EXAMPLES 미설정이면 NODE_ENV production에서 false를 default로 가진다", async () => {
    process.env.NODE_ENV = "production";
    const env = await load();
    expect(env.ENABLE_EXAMPLES).toBe(false);
  });
});
