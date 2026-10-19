import { IPC_CHANNELS } from "@shared/ipc/channels";
import type { IpcMain } from "electron";
import { describe, expect, it, vi } from "vitest";

import {
  buildSystemInfo,
  registerSystemHandlers,
} from "../../../src/main/ipc/system";

const fakeIpcMain = (handle: ReturnType<typeof vi.fn>): IpcMain =>
  ({ handle }) as unknown as IpcMain;

describe("system IPC", () => {
  it("buildSystemInfo가 현재 프로세스의 플랫폼과 버전 정보를 반환한다", () => {
    const info = buildSystemInfo();

    expect(info.platform).toBe(process.platform);
    expect(info.nodeVersion).toBe(process.versions.node);
    expect(typeof info.chromeVersion).toBe("string");
    expect(typeof info.electronVersion).toBe("string");
  });

  it("registerSystemHandlers가 system:getInfo 채널에 핸들러를 등록한다", () => {
    const handle = vi.fn();

    registerSystemHandlers(fakeIpcMain(handle));

    expect(handle).toHaveBeenCalledWith(
      IPC_CHANNELS.systemGetInfo,
      expect.any(Function),
    );
  });

  it("등록된 system:getInfo 핸들러가 호출되면 시스템 정보를 반환한다", () => {
    const handle = vi.fn();
    registerSystemHandlers(fakeIpcMain(handle));

    const handler = handle.mock.calls[0]?.[1] as () => unknown;

    expect(handler()).toEqual(buildSystemInfo());
  });
});
