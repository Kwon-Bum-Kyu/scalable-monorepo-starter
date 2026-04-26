import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "../../../../src/errors/app-error";
import { checkReadiness } from "../../../../src/services/health/check-readiness";

vi.mock("../../../../src/repositories/health/ping-database", () => ({
  pingDatabase: vi.fn(),
}));

const { pingDatabase } = await import(
  "../../../../src/repositories/health/ping-database"
);
const pingDatabaseMock = pingDatabase as unknown as ReturnType<typeof vi.fn>;

describe("checkReadiness", () => {
  beforeEach(() => {
    pingDatabaseMock.mockReset();
  });

  it("DB ping이 ok면 checks.db가 \"ok\"인 응답을 반환한다", async () => {
    pingDatabaseMock.mockResolvedValueOnce("ok");

    const result = await checkReadiness();

    expect(result.status).toBe("ok");
    expect(result.checks.db).toBe("ok");
    expect(result.timestamp).toEqual(expect.any(String));
  });

  it("DB ping이 down이면 SERVICE_UNAVAILABLE 503 details.db=\"down\"으로 throw한다", async () => {
    pingDatabaseMock.mockResolvedValueOnce("down");

    await expect(checkReadiness()).rejects.toMatchObject({
      statusCode: 503,
      code: "SERVICE_UNAVAILABLE",
      details: { db: "down" },
    });
  });

  it("DB ping이 timeout이면 SERVICE_UNAVAILABLE 503 details.db=\"timeout\"으로 throw한다", async () => {
    pingDatabaseMock.mockResolvedValueOnce("timeout");

    await expect(checkReadiness()).rejects.toBeInstanceOf(AppError);
    pingDatabaseMock.mockResolvedValueOnce("timeout");
    await expect(checkReadiness()).rejects.toMatchObject({
      statusCode: 503,
      code: "SERVICE_UNAVAILABLE",
      details: { db: "timeout" },
    });
  });
});
