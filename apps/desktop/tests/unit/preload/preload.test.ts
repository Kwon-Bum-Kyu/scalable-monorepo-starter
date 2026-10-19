import { type DesktopApi, IPC_CHANNELS } from "@shared/ipc/channels";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { exposeInMainWorld, invoke } = vi.hoisted(() => ({
  exposeInMainWorld: vi.fn(),
  invoke: vi.fn(),
}));

vi.mock("electron", () => ({
  contextBridge: { exposeInMainWorld },
  ipcRenderer: { invoke },
}));

describe("preload desktop API", () => {
  beforeEach(() => {
    vi.resetModules();
    exposeInMainWorld.mockClear();
    invoke.mockClear();
  });

  it("desktop 네임스페이스로 platform과 getSystemInfo를 노출한다", async () => {
    await import("../../../src/preload/index");

    const call = exposeInMainWorld.mock.calls[0];
    expect(call?.[0]).toBe("desktop");
    const api = call?.[1] as DesktopApi;
    expect(api.platform).toBe(process.platform);
    expect(typeof api.getSystemInfo).toBe("function");
  });

  it("getSystemInfo가 system:getInfo 채널로 invoke한다", async () => {
    await import("../../../src/preload/index");

    const api = exposeInMainWorld.mock.calls[0]?.[1] as DesktopApi;
    void api.getSystemInfo();

    expect(invoke).toHaveBeenCalledWith(IPC_CHANNELS.systemGetInfo);
  });
});
