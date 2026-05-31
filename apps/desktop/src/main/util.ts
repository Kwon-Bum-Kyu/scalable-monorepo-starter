import { join } from "node:path";

export interface RendererTarget {
  type: "url" | "file";
  value: string;
}

// renderer 로드 대상을 결정한다.
// dev(비패키징 + electron-vite dev server URL 존재)면 dev 서버 URL을,
// 그 외(프로덕션/패키징)에는 빌드된 index.html(file://) 경로를 반환한다.
export function resolveRendererUrl(
  isPackaged: boolean,
  rendererUrlEnv: string | undefined,
  rendererDir: string,
): RendererTarget {
  if (!isPackaged && rendererUrlEnv) {
    return { type: "url", value: rendererUrlEnv };
  }

  return { type: "file", value: join(rendererDir, "index.html") };
}
