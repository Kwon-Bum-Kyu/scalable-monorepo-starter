import { describe, expect, it } from "vitest";

import { resolveRendererUrl } from "../../../src/main/util";

describe("resolveRendererUrl", () => {
  it("패키징되지 않고 ELECTRON_RENDERER_URL이 있을 때 dev 서버 URL을 반환한다", () => {
    const target = resolveRendererUrl(
      false,
      "http://localhost:3100",
      "/app/out/renderer",
    );

    expect(target).toEqual({
      type: "url",
      value: "http://localhost:3100",
    });
  });

  it("패키징되었을 때 빌드된 index.html 파일 경로를 반환한다", () => {
    const target = resolveRendererUrl(
      true,
      "http://localhost:3100",
      "/app/out/renderer",
    );

    expect(target.type).toBe("file");
    expect(target.value).toContain("index.html");
  });

  it("패키징되지 않았지만 ELECTRON_RENDERER_URL이 없을 때 file 경로를 반환한다", () => {
    const target = resolveRendererUrl(false, undefined, "/app/out/renderer");

    expect(target.type).toBe("file");
    expect(target.value).toContain("index.html");
  });
});
