import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("Health API", () => {
  it("헬스 체크 요청 시 표준 응답 형식으로 상태 정보를 반환한다", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      status: "ok",
      environment: "test",
    });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });
});
