import { join } from "node:path";

import { app, BrowserWindow, shell } from "electron";

// 메인 프로세스: BrowserWindow 생성 후 dev는 electron-vite dev server URL을,
// 패키징/프로덕션은 빌드된 renderer index.html(file://)을 로드한다.
function createWindow(): void {
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

  if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    void mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

void app.whenReady().then(() => {
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
