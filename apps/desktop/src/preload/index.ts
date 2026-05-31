import { type DesktopApi, IPC_CHANNELS } from "@shared/ipc/channels";
import { contextBridge, ipcRenderer } from "electron";

// contextIsolation 환경에서 renderer(window.desktop)로 안전하게 노출할 API.
// 채널 문자열은 preload 안에 캡슐화하여 renderer는 채널명을 알 필요가 없다.
const desktopApi: DesktopApi = {
  platform: process.platform,
  versions: process.versions,
  getSystemInfo: () => ipcRenderer.invoke(IPC_CHANNELS.systemGetInfo),
};

contextBridge.exposeInMainWorld("desktop", desktopApi);
