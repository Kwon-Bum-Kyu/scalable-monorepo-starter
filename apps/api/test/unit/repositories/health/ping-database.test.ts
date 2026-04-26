import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { pingDatabase } from "../../../../src/repositories/health/ping-database";

vi.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

const { prisma } = await import("../../../../src/lib/prisma");
const queryRawMock = prisma.$queryRaw as unknown as ReturnType<typeof vi.fn>;

describe("pingDatabase", () => {
  beforeEach(() => {
    queryRawMock.mockReset();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("DB가 정상이면 \"ok\"를 반환한다", async () => {
    queryRawMock.mockResolvedValueOnce([{ "?column?": 1 }]);

    const result = await pingDatabase(1000);

    expect(result).toBe("ok");
    expect(queryRawMock).toHaveBeenCalledTimes(1);
  });

  it("타임아웃 초과 시 \"timeout\"을 반환한다", async () => {
    queryRawMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve([{ "?column?": 1 }]), 5000);
        }),
    );

    const result = await pingDatabase(20);

    expect(result).toBe("timeout");
  });

  it("쿼리 실패 시 \"down\"을 반환한다", async () => {
    queryRawMock.mockRejectedValueOnce(new Error("connection refused"));

    const result = await pingDatabase(1000);

    expect(result).toBe("down");
  });
});
