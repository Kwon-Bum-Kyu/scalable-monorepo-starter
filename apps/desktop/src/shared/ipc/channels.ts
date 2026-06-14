// apps/desktop의 main(node)과 renderer(web)가 함께 참조하는 IPC 채널 단일 출처(SSOT).
// packages/shared-types는 web/api 공유 + 런타임 코드 금지 영역이라, desktop 전용 IPC
// 채널 상수/타입은 워크스페이스 로컬인 이곳에 둔다.

// 채널명은 "<domain>:<action>" 형식으로 통일한다.
export const IPC_CHANNELS = {
  systemGetInfo: "system:getInfo",
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

// system:getInfo 응답 페이로드.
export interface SystemInfo {
  platform: NodeJS.Platform;
  electronVersion: string;
  chromeVersion: string;
  nodeVersion: string;
}

// preload가 contextBridge로 renderer에 노출하는 window.desktop API 계약.
export interface DesktopApi {
  platform: NodeJS.Platform;
  versions: NodeJS.ProcessVersions;
  getSystemInfo: () => Promise<SystemInfo>;
}
