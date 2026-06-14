import { app, BrowserWindow, ipcMain } from "electron";

import { registerIpcHandlers } from "./ipc";
import { applyApplicationMenu } from "./menu";
import { createWindow } from "./window";

// 메인 프로세스 엔트리: 애플리케이션 메뉴와 IPC 핸들러를 등록한 뒤
// 창을 생성하고 앱 생명주기를 관리한다. 세부 동작은 window/menu/ipc 모듈에 위임한다.
void app.whenReady().then(() => {
  applyApplicationMenu();
  registerIpcHandlers(ipcMain);
  createWindow();

  app.on("activate", () => {
    // macOS: dock 아이콘 클릭 시 창이 없으면 다시 생성한다.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // macOS 외 플랫폼은 모든 창이 닫히면 앱을 종료한다.
  if (process.platform !== "darwin") {
    app.quit();
  }
});
