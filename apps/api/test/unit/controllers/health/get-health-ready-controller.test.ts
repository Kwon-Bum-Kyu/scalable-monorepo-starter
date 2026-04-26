import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getHealthReadyController } from "../../../../src/controllers/health/get-health-ready-controller";
import { AppError } from "../../../../src/errors/app-error";

vi.mock("../../../../src/services/health/check-readiness", () => ({
  checkReadiness: vi.fn(),
}));

const { checkReadiness } = await import(
  "../../../../src/services/health/check-readiness"
);
const checkReadinessMock = checkReadiness as unknown as ReturnType<typeof vi.fn>;

const makeResponse = () => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json } as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
};

describe("getHealthReadyController", () => {
  beforeEach(() => {
    checkReadinessMock.mockReset();
  });

  it("readiness 결과를 sendSuccess envelope으로 응답한다", async () => {
    const readiness = {
      status: "ok" as const,
      checks: { db: "ok" as const },
      timestamp: "2026-04-26T00:00:00.000Z",
    };
    checkReadinessMock.mockResolvedValueOnce(readiness);
    const response = makeResponse();
    const next = vi.fn() as unknown as NextFunction;

    await getHealthReadyController({} as Request, response, next);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: readiness,
    });
  });

  it("checkReadiness가 throw하면 next(error)로 위임한다", async () => {
    const error = new AppError(
      "DB unavailable",
      503,
      "SERVICE_UNAVAILABLE",
      { db: "down" },
    );
    checkReadinessMock.mockRejectedValueOnce(error);
    const response = makeResponse();
    const next = vi.fn() as unknown as NextFunction;

    await getHealthReadyController({} as Request, response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
