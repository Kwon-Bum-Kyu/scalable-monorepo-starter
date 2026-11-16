import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { buildPlan } from "../../../src/setup/buildPlan.mjs";
import type { readManifest } from "../../../src/setup/manifest.mjs";

type Manifest = ReturnType<typeof readManifest>;

const tempDirectories: string[] = [];

function write(root: string, relativePath: string, content = ""): void {
  const target = path.join(root, relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function fakeManifest(): Manifest {
  return {
    apps: [
      {
        id: "api",
        label: "api",
        hint: "API",
        dir: "apps/api",
        default: true,
        requires: [],
        packages: ["base"],
        rootScripts: ["dev:api"],
        paths: [],
        dev: {
          script: "dev:api",
          url: "http://localhost:4000",
          note: null,
          prerequisite: "Docker 필요",
        },
      },
      {
        id: "web",
        label: "web",
        hint: "Web",
        dir: "apps/web",
        default: true,
        requires: [],
        packages: ["base", "ui"],
        rootScripts: ["dev:web"],
        paths: [],
        dev: {
          script: "dev:web",
          url: "http://localhost:3000",
          note: null,
          prerequisite: null,
        },
      },
      {
        id: "desktop",
        label: "desktop",
        hint: "Desktop",
        dir: "apps/desktop",
        default: false,
        requires: [],
        packages: ["base", "ui"],
        rootScripts: ["dev:desktop"],
        paths: [],
        dev: {
          script: "dev:desktop",
          url: null,
          note: "창으로 열립니다",
          prerequisite: null,
        },
      },
    ],
    packages: [
      { id: "base", dir: "packages/base", always: true, paths: [] },
      {
        id: "ui",
        dir: "packages/ui",
        always: false,
        paths: ["DESIGN.md", "PRODUCT.md"],
      },
    ],
    conditionalPaths: [
      {
        path: "scripts/check-parity.mjs",
        keepWhen: { apps: ["web", "desktop"] },
        rootScripts: ["check:parity"],
      },
    ],
    templateOnly: [
      "packages/create-scalable-monorepo-starter",
      "CONTRIBUTING.md",
    ],
    markerFiles: ["marker.md"],
    rename: {
      from: "starter-name",
      displayFrom: "Starter Name",
      npmNameFiles: ["rename-root"],
      displayNameFiles: ["display.txt"],
      replacements: [
        {
          file: "apps/api/config.txt",
          from: "container_name: old",
          to: "container_name: {{npmName}}",
        },
      ],
    },
  };
}

function makeTemplate(): { root: string; manifest: Manifest } {
  const root = mkdtempSync(path.join(tmpdir(), "build-plan-"));
  tempDirectories.push(root);
  const manifest = fakeManifest();

  for (const directory of [
    "apps/api",
    "apps/web",
    "apps/desktop",
    "packages/base",
    "packages/ui",
    "rename-root",
    "scripts",
  ]) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  write(
    root,
    "package.json",
    JSON.stringify({
      name: "starter-name",
      version: "1.0.0",
      scripts: {
        setup: "setup",
        "dev:api": "api",
        "dev:web": "web",
        "dev:desktop": "desktop",
        "check:parity": "check",
      },
    }),
  );
  write(
    root,
    "package-lock.json",
    JSON.stringify({ name: "starter-name", packages: { "": {} } }),
  );
  write(
    root,
    "turbo.json",
    JSON.stringify({ globalDependencies: ["DESIGN.md", "keep.txt"] }),
  );
  write(root, "README.md", "old readme\n");
  write(
    root,
    "marker.md",
    "before\n<!-- >>> APP:web -->\nweb\n<!-- <<< APP:web -->\n",
  );
  write(root, "rename-root/name.txt", "starter-name\n");
  write(root, "display.txt", "Starter Name\n");
  write(root, "apps/api/config.txt", "container_name: old\n");
  write(root, "DESIGN.md", "design\n");
  write(root, "PRODUCT.md", "product\n");
  write(root, "keep.txt", "keep\n");
  write(root, "scripts/check-parity.mjs", "check\n");
  write(root, "CONTRIBUTING.md", "contribute\n");
  write(
    root,
    "packages/create-scalable-monorepo-starter/src/setup/readme.template.md",
    "# {{displayName}}\n\n{{npmName}}\n\n{{appLines}}\n",
  );
  write(
    root,
    "packages/create-scalable-monorepo-starter/starter.manifest.json",
    JSON.stringify(manifest),
  );
  return { root, manifest };
}

function plan(root: string, manifest: Manifest, selectedApps = ["web"]) {
  return buildPlan({
    rootDir: root,
    manifest,
    selectedApps,
    removeExamples: false,
    displayName: "My App",
    npmName: "my-app",
  });
}

function snapshot(root: string, relativePath = ""): string[] {
  const directory = path.join(root, relativePath);
  return readdirSync(directory)
    .sort()
    .flatMap((name) => {
      const relative = path.join(relativePath, name);
      const stat = lstatSync(path.join(root, relative));
      if (stat.isSymbolicLink()) {
        return [`link:${relative}`];
      }
      if (stat.isDirectory()) {
        return [`dir:${relative}`, ...snapshot(root, relative)];
      }
      return [
        `file:${relative}:${readFileSync(path.join(root, relative), "utf8")}`,
      ];
    });
}

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("buildPlan", () => {
  it("계획이 desktop을 선택하지 않았을 때 desktop 폴더를 삭제 경로에 넣는다", () => {
    const { root, manifest } = makeTemplate();

    expect(plan(root, manifest).removals).toContain("apps/desktop");
  });

  it("계획이 ui를 쓰는 앱이 없을 때 ui 패키지와 디자인 문서를 삭제 경로에 넣는다", () => {
    const { root, manifest } = makeTemplate();

    const result = plan(root, manifest, ["api"]);

    expect(result.removals).toEqual(
      expect.arrayContaining(["packages/ui", "DESIGN.md", "PRODUCT.md"]),
    );
    expect(result.edits).toContain("turbo.json");
  });

  it("계획이 ui를 쓰는 앱이 없을 때 지울 경로에 든 파일을 편집 파일에서 뺀다", () => {
    const { root, manifest } = makeTemplate();
    manifest.packages[1].paths.push("rename-root/removed.txt");
    write(root, "rename-root/removed.txt", "starter-name\n");

    const result = plan(root, manifest, ["api"]);

    expect(result.removals).toContain("rename-root/removed.txt");
    expect(result.edits).not.toContain("rename-root/removed.txt");
  });

  it("계획이 제거되는 앱의 루트 스크립트가 있을 때 package.json을 편집 파일에 넣는다", () => {
    const { root, manifest } = makeTemplate();

    expect(plan(root, manifest).edits).toContain("package.json");
  });

  it("계획이 web과 desktop을 모두 남기지 않을 때 parity 경로를 삭제한다", () => {
    const { root, manifest } = makeTemplate();

    expect(plan(root, manifest, ["web"]).removals).toContain(
      "scripts/check-parity.mjs",
    );
  });

  it("계획이 매니페스트에 mobile만 추가됐을 때 선택하지 않은 mobile 폴더를 삭제한다", () => {
    const { root, manifest } = makeTemplate();
    mkdirSync(path.join(root, "apps/mobile"));
    manifest.apps.push({
      ...structuredClone(manifest.apps[1]),
      id: "mobile",
      label: "mobile",
      dir: "apps/mobile",
      rootScripts: ["dev:mobile"],
      dev: { ...manifest.apps[1].dev, script: "dev:mobile" },
    });

    expect(plan(root, manifest).removals).toContain("apps/mobile");
  });

  it("계획이 마커의 짝이 맞지 않을 때 계산에 실패하고 파일을 바꿀 수 없다", () => {
    const { root, manifest } = makeTemplate();
    write(root, "marker.md", "<!-- >>> APP:web -->\ncontent\n");
    const before = snapshot(root);

    expect(() => plan(root, manifest)).toThrow(
      "블록 마커의 짝이 맞지 않습니다.",
    );
    expect(snapshot(root)).toEqual(before);
  });

  it("계획이 지워지는 앱의 개별 치환 파일을 만날 때 치환 검증을 건너뛴다", () => {
    const { root, manifest } = makeTemplate();
    manifest.rename.replacements[0].file = "apps/desktop/config.txt";
    write(root, "apps/desktop/config.txt", "치환 대상 없음\n");

    expect(() => plan(root, manifest)).not.toThrow();
  });

  it("계획이 남는 개별 치환 파일에서 원본 문자열을 찾지 못할 때 계산에 실패한다", () => {
    const { root, manifest } = makeTemplate();
    write(root, "apps/api/config.txt", "치환 대상 없음\n");

    expect(() => plan(root, manifest, ["api"])).toThrow("apps/api/config.txt");
  });

  it("계획이 지울 폴더 안에서 환경 변수 파일을 찾을 때 경로를 알리고 실패한다", () => {
    const { root, manifest } = makeTemplate();
    write(root, "apps/desktop/.env.local", "SECRET=value\n");

    expect(() => plan(root, manifest)).toThrow("apps/desktop/.env.local");
  });

  it("계획이 지울 폴더 안에서 env example만 찾을 때 실패하지 않는다", () => {
    const { root, manifest } = makeTemplate();
    write(root, "apps/desktop/.env.example", "SAFE=value\n");

    expect(() => plan(root, manifest)).not.toThrow();
  });

  it("계획이 지울 폴더의 node_modules에서 환경 변수 파일을 찾을 때 무시한다", () => {
    const { root, manifest } = makeTemplate();
    write(root, "apps/desktop/node_modules/pkg/.env.test", "SAFE=value\n");

    expect(() => plan(root, manifest)).not.toThrow();
  });

  it("계획이 이름 치환 폴더에서 symlink를 만날 때 따라가지 않고 안내에 넣는다", () => {
    const { root, manifest } = makeTemplate();
    write(root, "outside.txt", "starter-name\n");
    symlinkSync("../outside.txt", path.join(root, "rename-root/linked.txt"));

    const result = plan(root, manifest);

    expect(result.notices.join("\n")).toContain("rename-root/linked.txt");
    expect(result.edits).not.toContain("rename-root/linked.txt");
  });

  it("계획이 이름으로 지정된 마커 파일에서 symlink를 만날 때 계산에 실패한다", () => {
    const { root, manifest } = makeTemplate();
    write(root, "marker-target.md", "content\n");
    rmSync(path.join(root, "marker.md"));
    symlinkSync("marker-target.md", path.join(root, "marker.md"));

    expect(() => plan(root, manifest)).toThrow("symlink");
  });

  it("계획이 README를 렌더링할 때 README를 편집 파일에 넣는다", () => {
    const { root, manifest } = makeTemplate();

    expect(plan(root, manifest).edits).toContain("README.md");
  });

  it("계획이 정상적으로 계산될 때 입력 객체와 템플릿 파일을 바꾸지 않는다", () => {
    const { root, manifest } = makeTemplate();
    const manifestBefore = structuredClone(manifest);
    const filesBefore = snapshot(root);

    plan(root, manifest);

    expect(manifest).toEqual(manifestBefore);
    expect(snapshot(root)).toEqual(filesBefore);
  });
});
