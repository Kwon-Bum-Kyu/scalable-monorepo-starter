import { describe, expect, it } from "vitest";

import {
  readManifest,
  validateManifest,
} from "../../../src/setup/manifest.mjs";

function validManifest(): ReturnType<typeof readManifest> {
  return {
    apps: [
      {
        id: "web",
        label: "web",
        hint: "React",
        dir: "apps/web",
        default: true,
        requires: [],
        packages: ["ui"],
        rootScripts: ["dev:web"],
        paths: ["docs/web"],
        dev: {
          script: "dev:web",
          url: "http://localhost:3000",
          note: null,
          prerequisite: null,
        },
      },
    ],
    packages: [
      {
        id: "ui",
        dir: "packages/ui",
        always: false,
        paths: ["DESIGN.md"],
      },
    ],
    conditionalPaths: [
      {
        path: "scripts/check.mjs",
        keepWhen: { apps: ["web"], examples: true },
        rootScripts: ["check"],
      },
    ],
    templateOnly: ["CONTRIBUTING.md"],
    markerFiles: [".env.example"],
    rename: {
      from: "starter",
      displayFrom: "Starter",
      npmNameFiles: ["CLAUDE.md"],
      displayNameFiles: ["apps/web/index.html"],
      replacements: [
        {
          file: "apps/web/config.txt",
          from: "old",
          to: "{{npmName}}",
        },
      ],
    },
  } as ReturnType<typeof readManifest>;
}

describe("manifest", () => {
  it("매니페스트가 실제 파일을 읽을 때 앱 4개를 정해진 순서로 반환한다", () => {
    const manifest = readManifest();

    expect(manifest.apps.map((app) => app.id)).toEqual([
      "api",
      "web",
      "desktop",
      "storybook",
    ]);
  });

  it("매니페스트가 유효한 계약을 가질 때 입력 객체를 그대로 반환한다", () => {
    const manifest = validManifest();

    expect(validateManifest(manifest)).toBe(manifest);
  });

  it("매니페스트가 필수 최상위 필드를 빠뜨렸을 때 검증에 실패한다", () => {
    const { apps: _apps, ...manifest } = validManifest();

    expect(() => validateManifest(manifest)).toThrow("apps");
  });

  it("앱이 예약 id template을 사용할 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.apps[0].id = "template";

    expect(() => validateManifest(manifest)).toThrow("apps[0].id");
  });

  it("앱 id가 형식에 맞지 않을 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.apps[0].id = "Web_App";

    expect(() => validateManifest(manifest)).toThrow("apps[0].id");
  });

  it("앱이 중복 id를 가질 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.apps.push(structuredClone(manifest.apps[0]));

    expect(() => validateManifest(manifest)).toThrow("apps[1].id");
  });

  it("앱의 requires가 없는 앱 id를 가리킬 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.apps[0].requires = ["api"];

    expect(() => validateManifest(manifest)).toThrow("apps[0].requires[0]");
  });

  it("앱의 packages가 없는 패키지 id를 가리킬 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.apps[0].packages = ["missing"];

    expect(() => validateManifest(manifest)).toThrow("apps[0].packages[0]");
  });

  it("조건부 경로가 없는 앱 id를 가리킬 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.conditionalPaths[0].keepWhen.apps = ["api"];

    expect(() => validateManifest(manifest)).toThrow(
      "conditionalPaths[0].keepWhen.apps[0]",
    );
  });

  it("dev url과 note가 모두 비어 있을 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.apps[0].dev.url = null;

    expect(() => validateManifest(manifest)).toThrow("apps[0].dev.note");
  });

  it("dev url과 note가 모두 값이 있을 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.apps[0].dev.note = "브라우저로 엽니다";

    expect(() => validateManifest(manifest)).toThrow("apps[0].dev.note");
  });

  it("경로 필드에 상위 경로가 있을 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.apps[0].paths = ["../secret"];

    expect(() => validateManifest(manifest)).toThrow("apps[0].paths[0]");
  });

  it("rename replacements의 file에 절대 경로가 있을 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.rename.replacements[0].file = "/tmp/config.txt";

    expect(() => validateManifest(manifest)).toThrow(
      "rename.replacements[0].file",
    );
  });

  it("윈도우 절대 경로가 있을 때 매니페스트 검증에 실패한다", () => {
    const manifest = validManifest();
    manifest.markerFiles = ["C:\\temp\\config.txt"];

    expect(() => validateManifest(manifest)).toThrow("markerFiles[0]");
  });
});
