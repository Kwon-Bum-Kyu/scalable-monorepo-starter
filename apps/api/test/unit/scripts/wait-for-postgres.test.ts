import { describe, expect, it, vi } from "vitest";

import { waitForPostgres } from "../../../../../scripts/lib/wait-for-postgres.mjs";

describe("waitForPostgres", () => {
  it("처음 두 번 실패하고 세 번째에 성공할 때 재시도 후 성공한다", async () => {
    const exec = vi
      .fn<() => Promise<{ code: number }>>()
      .mockResolvedValueOnce({ code: 1 })
      .mockResolvedValueOnce({ code: 1 })
      .mockResolvedValueOnce({ code: 0 });
    const sleep = vi.fn<(ms: number) => Promise<void>>().mockResolvedValue(undefined);

    const result = await waitForPostgres({ exec, maxAttempts: 5, intervalMs: 10, sleep });

    expect(result.attempts).toBe(3);
    expect(exec).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(10);
  });

  it("maxAttempts를 모두 소진해도 성공하지 못하면 실패한다", async () => {
    const exec = vi.fn<() => Promise<{ code: number }>>().mockResolvedValue({ code: 1 });
    const sleep = vi.fn<(ms: number) => Promise<void>>().mockResolvedValue(undefined);

    await expect(
      waitForPostgres({ exec, maxAttempts: 3, intervalMs: 10, sleep }),
    ).rejects.toThrow(/3.*시도/);
    expect(exec).toHaveBeenCalledTimes(3);
  });

  it("exec가 던지는 일시 오류도 재시도로 흡수한다", async () => {
    const exec = vi
      .fn<() => Promise<{ code: number }>>()
      .mockRejectedValueOnce(new Error("docker not ready"))
      .mockResolvedValueOnce({ code: 0 });
    const sleep = vi.fn<(ms: number) => Promise<void>>().mockResolvedValue(undefined);

    const result = await waitForPostgres({ exec, maxAttempts: 5, intervalMs: 10, sleep });

    expect(result.attempts).toBe(2);
    expect(exec).toHaveBeenCalledTimes(2);
  });
});
