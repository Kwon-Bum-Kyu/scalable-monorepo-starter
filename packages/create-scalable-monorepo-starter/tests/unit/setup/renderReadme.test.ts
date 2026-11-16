import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { readManifest } from "../../../src/setup/manifest.mjs";
import { renderReadme } from "../../../src/setup/renderReadme.mjs";

const template = readFileSync(
  new URL("../../../src/setup/readme.template.md", import.meta.url),
  "utf8",
);
const rendererSource = readFileSync(
  new URL("../../../src/setup/renderReadme.mjs", import.meta.url),
  "utf8",
);

describe("renderReadme", () => {
  it("README가 표시 이름을 받을 때 프로젝트 제목에 표시 이름을 쓴다", () => {
    const result = renderReadme(template, readManifest(), ["web"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).toMatch(/^# My Shop$/mu);
  });

  it("README가 앱을 선택하지 않았을 때 그 앱의 기동 줄을 만들지 않는다", () => {
    const result = renderReadme(template, readManifest(), ["web"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).toContain("npm run dev:web");
    expect(result).not.toContain("npm run dev:desktop");
  });

  it("README가 주소 없는 앱을 렌더링할 때 주소 대신 설명을 쓴다", () => {
    const result = renderReadme(template, readManifest(), ["desktop"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).toContain("Electron 창으로 열립니다");
  });

  it("README가 사전 조건이 있는 앱을 렌더링할 때 기동 줄에 조건을 함께 쓴다", () => {
    const result = renderReadme(template, readManifest(), ["api"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).toMatch(
      /npm run dev:api.*http:\/\/localhost:4000.*Docker가 실행 중이어야 합니다/u,
    );
  });

  it("README가 앱 하나만 선택했을 때 전체 기동 줄을 만들지 않는다", () => {
    const result = renderReadme(template, readManifest(), ["web"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).not.toMatch(/`npm run dev`/u);
  });

  it("README가 앱을 둘 이상 선택했을 때 전체 기동 줄을 만든다", () => {
    const result = renderReadme(template, readManifest(), ["api", "web"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).toContain("`npm run dev`");
  });

  it("README가 매니페스트에 앱만 추가됐을 때 새 앱의 기동 줄을 만든다", () => {
    const manifest = structuredClone(readManifest());
    manifest.apps.push({
      id: "mobile",
      label: "mobile",
      hint: "Mobile",
      dir: "apps/mobile",
      default: false,
      requires: [],
      packages: [],
      rootScripts: ["dev:mobile"],
      paths: [],
      dev: {
        script: "dev:mobile",
        url: null,
        note: "시뮬레이터로 열립니다",
        prerequisite: null,
      },
    });

    const result = renderReadme(template, manifest, ["mobile"], {
      displayName: "My App",
      npmName: "my-app",
    });

    expect(result).toContain("npm run dev:mobile");
    expect(result).toContain("시뮬레이터로 열립니다");
  });

  it("README가 생성될 때 출처와 저장소 링크를 포함한다", () => {
    const result = renderReadme(template, readManifest(), ["web"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).toContain("scalable-monorepo-starter로 생성했습니다");
    expect(result).toContain(
      "https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter",
    );
  });

  it("README가 생성될 때 홈 화면 교체 안내를 포함한다", () => {
    const result = renderReadme(template, readManifest(), ["web"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).toContain(
      "홈 화면은 스타터 소개용 예시이므로 교체해 주세요.",
    );
  });

  it("README가 생성될 때 채워지지 않은 자리표시를 남기지 않는다", () => {
    const result = renderReadme(template, readManifest(), ["web"], {
      displayName: "My Shop",
      npmName: "my-shop",
    });

    expect(result).not.toMatch(/\{\{[^}]+\}\}/u);
  });

  it("README 템플릿과 렌더러가 앱 id나 APP 마커를 코드 상수로 갖지 않는다", () => {
    const sources = `${template}\n${rendererSource}`;

    expect(sources).not.toContain("APP:");
    for (const { id } of readManifest().apps) {
      expect(sources).not.toMatch(new RegExp(`\\b${id}\\b`, "u"));
    }
  });
});
