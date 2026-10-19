import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getHealthLiveController } from "../../../../src/controllers/health/get-health-live-controller";

vi.mock("../../../../src/services/health/check-liveness", () => ({
  checkLiveness: vi.fn(),
}));

const { checkLiveness } = await import(
  "../../../../src/services/health/check-liveness"
);
const checkLivenessMock = checkLiveness as unknown as ReturnType<typeof vi.fn>;

const makeResponse = () => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json } as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
};

describe("getHealthLiveController", () => {
  beforeEach(() => {
    checkLivenessMock.mockReset();
  });

  it("liveness 결과를 sendSuccess envelope으로 응답한다", () => {
    const liveness = {
      status: "ok" as const,
      uptime: 12.5,
      timestamp: "2026-04-26T00:00:00.000Z",
    };
    checkLivenessMock.mockReturnValueOnce(liveness);
    const response = makeResponse();

    getHealthLiveController(
      {} as Request,
      response,
      vi.fn() as unknown as NextFunction,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      data: liveness,
    });
  });
});
