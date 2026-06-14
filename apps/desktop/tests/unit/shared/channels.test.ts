import { IPC_CHANNELS } from "@shared/ipc/channels";
import { describe, expect, it } from "vitest";

describe("IPC 채널 상수", () => {
  it("모든 채널 값이 도메인:액션 형식이다", () => {
    const pattern = /^[a-z][a-zA-Z]*:[a-zA-Z]+$/;
    for (const channel of Object.values(IPC_CHANNELS)) {
      expect(channel).toMatch(pattern);
    }
  });

  it("systemGetInfo 채널이 system:getInfo로 정의된다", () => {
    expect(IPC_CHANNELS.systemGetInfo).toBe("system:getInfo");
  });
});
