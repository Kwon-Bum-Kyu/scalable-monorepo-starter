// preload(src/preload/index.ts)가 contextBridge로 노출하는 window.desktop 타입.
export {};

declare global {
  interface Window {
    desktop: {
      platform: NodeJS.Platform;
      versions: NodeJS.ProcessVersions;
    };
  }
}
