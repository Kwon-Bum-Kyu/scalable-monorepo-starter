import { IPC_CHANNELS, type SystemInfo } from "@shared/ipc/channels";
import type { IpcMain } from "electron";

// 현재 프로세스에서 시스템 정보를 수집한다. electron 런타임에 의존하지 않는 순수 함수.
export function buildSystemInfo(): SystemInfo {
  return {
    platform: process.platform,
    electronVersion: process.versions.electron ?? "",
    chromeVersion: process.versions.chrome ?? "",
    nodeVersion: process.versions.node,
  };
}

// system 도메인 IPC 핸들러를 ipcMain에 등록한다.
export function registerSystemHandlers(ipcMain: IpcMain): void {
  ipcMain.handle(IPC_CHANNELS.systemGetInfo, () => buildSystemInfo());
}
