import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import app from "../../src/app";

vi.mock("../../src/repositories/health/ping-database", () => ({
  pingDatabase: vi.fn().mockResolvedValue("ok"),
}));

const { pingDatabase } = await import(
  "../../src/repositories/health/ping-database"
);
const pingDatabaseMock = pingDatabase as unknown as ReturnType<typeof vi.fn>;

describe("Health API", () => {
  afterEach(() => {
    pingDatabaseMock.mockReset();
    pingDatabaseMock.mockResolvedValue("ok");
  });

  it("기존 GET /health는 v0 응답 그대로 200을 반환한다", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      status: "ok",
      environment: "test",
    });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });

  it("GET /health/live는 200과 status:\"ok\"를 반환한다", async () => {
    const response = await request(app).get("/health/live");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(typeof response.body.data.uptime).toBe("number");
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });

  it("GET /health/ready는 DB 정상 시 200을 반환한다", async () => {
    pingDatabaseMock.mockResolvedValueOnce("ok");

    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      status: "ok",
      checks: { db: "ok" },
    });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });

  it("GET /health/ready는 DB 실패 시 503 SERVICE_UNAVAILABLE과 details.db를 반환한다", async () => {
    pingDatabaseMock.mockResolvedValueOnce("down");

    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("SERVICE_UNAVAILABLE");
    expect(response.body.error.details).toEqual({ db: "down" });
  });
});
