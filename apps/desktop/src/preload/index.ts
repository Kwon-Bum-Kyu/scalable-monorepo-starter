import { contextBridge } from "electron";

// contextIsolation 환경에서 renderer(window.desktop)로 안전하게 노출할 API.
// 필요 시 ipcRenderer.invoke 기반 메서드를 여기에 추가한다.
const desktopApi = {
  platform: process.platform,
  versions: process.versions,
} as const;

export type DesktopApi = typeof desktopApi;

contextBridge.exposeInMainWorld("desktop", desktopApi);
