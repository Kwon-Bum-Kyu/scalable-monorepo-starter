import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("보안 미들웨어 통합", () => {
  describe("[Helmet]", () => {
    it("응답에 X-Content-Type-Options=nosniff 헤더가 포함된다", async () => {
      const response = await request(app).get("/health");

      expect(response.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("test 환경에서는 Strict-Transport-Security 헤더를 부여하지 않는다", async () => {
      const response = await request(app).get("/health");

      expect(response.headers["strict-transport-security"]).toBeUndefined();
    });
  });

  describe("[CORS]", () => {
    it("허용 origin이면 동일 origin 그대로 echo한다", async () => {
      const response = await request(app)
        .get("/health")
        .set("Origin", "http://localhost:3000");

      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBe(
        "http://localhost:3000",
      );
    });

    it("허용되지 않은 origin이면 403 CORS_ORIGIN_DENIED를 반환한다", async () => {
      const response = await request(app)
        .get("/health")
        .set("Origin", "https://evil.example.com");

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("CORS_ORIGIN_DENIED");
      expect(response.body.error.details).toMatchObject({
        origin: "https://evil.example.com",
      });
    });
  });

  describe("[Request-Id]", () => {
    it("응답에 X-Request-Id 헤더가 자동으로 부여된다", async () => {
      const response = await request(app).get("/health");

      expect(response.headers["x-request-id"]).toEqual(expect.any(String));
      expect(response.headers["x-request-id"].length).toBeGreaterThan(0);
    });

    it("요청 헤더의 X-Request-Id를 응답에 그대로 반영한다", async () => {
      const customId = "test-request-id-12345";
      const response = await request(app)
        .get("/health")
        .set("X-Request-Id", customId);

      expect(response.headers["x-request-id"]).toBe(customId);
    });
  });

  describe("[RateLimit 헤더]", () => {
    it("draft-7 표준 RateLimit 헤더를 부여한다", async () => {
      const response = await request(app).get("/health");

      expect(response.headers["ratelimit"]).toBeDefined();
      expect(response.headers["x-ratelimit-limit"]).toBeUndefined();
    });
  });
});
