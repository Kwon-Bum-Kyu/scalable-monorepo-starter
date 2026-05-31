// preload(src/preload/index.ts)가 contextBridge로 노출하는 window.desktop 타입.
// 채널/타입 단일 출처인 @shared/ipc/channels의 DesktopApi를 참조한다(중복 정의 제거).
import type { DesktopApi } from "@shared/ipc/channels";

declare global {
  interface Window {
    desktop: DesktopApi;
  }
}
