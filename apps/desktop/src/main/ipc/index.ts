import type { IpcMain } from "electron";

import { registerSystemHandlers } from "./system";

// 도메인별 IPC 핸들러를 일괄 등록한다. app.whenReady 시점에 한 번 호출한다.
export function registerIpcHandlers(ipcMain: IpcMain): void {
  registerSystemHandlers(ipcMain);
}
