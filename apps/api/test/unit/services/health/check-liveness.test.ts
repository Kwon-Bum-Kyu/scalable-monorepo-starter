import { describe, expect, it } from "vitest";

import { checkLiveness } from "../../../../src/services/health/check-liveness";

describe("checkLiveness", () => {
  it("uptime과 timestamp가 포함된 응답을 반환한다", () => {
    const result = checkLiveness();

    expect(result.status).toBe("ok");
    expect(typeof result.uptime).toBe("number");
    expect(result.uptime).toBeGreaterThanOrEqual(0);
    expect(result.timestamp).toEqual(expect.any(String));
    expect(() => new Date(result.timestamp).toISOString()).not.toThrow();
  });

  it("호출마다 새로운 timestamp를 생성한다", async () => {
    const first = checkLiveness();
    await new Promise((resolve) => setTimeout(resolve, 5));
    const second = checkLiveness();

    expect(new Date(second.timestamp).getTime()).toBeGreaterThanOrEqual(
      new Date(first.timestamp).getTime(),
    );
  });
});
