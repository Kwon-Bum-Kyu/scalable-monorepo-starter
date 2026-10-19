import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("System API", () => {
  it("기본 요청 시 summary 형식의 시스템 메타데이터를 반환한다", async () => {
    const response = await request(app).get("/api/v1/system/info");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        name: "api",
        version: expect.any(String),
      },
    });
  });

  it("format=full 요청 시 시스템 메타데이터를 반환한다", async () => {
    const response = await request(app).get("/api/v1/system/info?format=full");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      name: "api",
      version: expect.any(String),
      environment: "test",
    });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });

  it("지원하지 않는 format 요청 시 검증 오류를 반환한다", async () => {
    const response = await request(app).get(
      "/api/v1/system/info?format=invalid",
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
  });

  it("존재하지 않는 경로 요청 시 공통 not found 오류를 반환한다", async () => {
    const response = await request(app).get("/api/v1/system/unknown");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "GET /api/v1/system/unknown 경로를 찾을 수 없습니다.",
      },
    });
  });
});
