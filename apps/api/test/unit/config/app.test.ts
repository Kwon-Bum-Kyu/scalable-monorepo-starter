import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("appConfig.environment", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalVersion = process.env.npm_package_version;

  beforeEach(() => {
    process.env.npm_package_version = "9.9.9";
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    process.env.npm_package_version = originalVersion;
  });

  const load = async () => {
    const mod = await import("../../../src/config/app");
    return mod.appConfig as { environment: string; version: string };
  };

  it("NODE_ENV가 development면 development를 반환한다", async () => {
    process.env.NODE_ENV = "development";
    const cfg = await load();
    expect(cfg.environment).toBe("development");
  });

  it("NODE_ENV가 test면 test를 반환한다", async () => {
    process.env.NODE_ENV = "test";
    const cfg = await load();
    expect(cfg.environment).toBe("test");
  });

  it("NODE_ENV가 production이면 production을 반환한다", async () => {
    process.env.NODE_ENV = "production";
    const cfg = await load();
    expect(cfg.environment).toBe("production");
  });

  it("NODE_ENV가 예상 밖이면 기본값 development로 대체한다", async () => {
    process.env.NODE_ENV = "staging";
    const cfg = await load();
    expect(cfg.environment).toBe("development");
  });

  it("npm_package_version 값이 version에 반영된다", async () => {
    process.env.NODE_ENV = "development";
    const cfg = await load();
    expect(cfg.version).toBe("9.9.9");
  });
});
