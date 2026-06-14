import { join } from "node:path";

import { app, BrowserWindow, shell } from "electron";

import { resolveRendererUrl } from "./util";

// BrowserWindow를 생성하고 renderer를 로드한다.
// 보안: sandbox + contextIsolation 유지, 외부 링크는 OS 기본 브라우저로 위임한다.
export function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // 외부 링크는 OS 기본 브라우저로 연다 (앱 창 내 임의 네비게이션 차단).
  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url);
    return { action: "deny" };
  });

  const target = resolveRendererUrl(
    app.isPackaged,
    process.env["ELECTRON_RENDERER_URL"],
    join(__dirname, "../renderer"),
  );

  if (target.type === "url") {
    void mainWindow.loadURL(target.value);
  } else {
    void mainWindow.loadFile(target.value);
  }

  return mainWindow;
}
