import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { applyPlan } from "../../../src/setup/applyPlan.mjs";
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
        id: "web",
        label: "web",
        hint: "Web",
        dir: "apps/web",
        default: true,
        requires: [],
        packages: ["base"],
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
        packages: ["base"],
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
    ],
    conditionalPaths: [],
    templateOnly: ["packages/create-scalable-monorepo-starter"],
    markerFiles: ["marker.md"],
    rename: {
      from: "starter-name",
      displayFrom: "Starter Name",
      npmNameFiles: ["rename.txt"],
      displayNameFiles: ["display.txt"],
      replacements: [],
    },
  };
}

function makeTemplate(): { root: string; manifest: Manifest } {
  const root = mkdtempSync(path.join(tmpdir(), "apply-plan-"));
  tempDirectories.push(root);
  const manifest = fakeManifest();

  for (const directory of ["apps/web", "apps/desktop", "packages/base"]) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  write(
    root,
    "package.json",
    `${JSON.stringify(
      {
        name: "starter-name",
        version: "1.1.0",
        scripts: {
          setup: "setup",
          "dev:web": "web",
          "dev:desktop": "desktop",
        },
      },
      null,
      2,
    )}\n`,
  );
  write(
    root,
    "package-lock.json",
    `${JSON.stringify(
      {
        name: "starter-name",
        packages: {
          "": { name: "starter-name" },
          "apps/web": {},
          "apps/desktop": {},
          "apps/desktop/node_modules/optional": {},
          "node_modules/desktop-alias": {
            link: true,
            resolved: "apps/desktop",
          },
          "packages/create-scalable-monorepo-starter": {},
          "packages/create-scalable-monorepo-starter/node_modules/tool": {},
          "node_modules/create-tool": {
            link: true,
            resolved: "packages/create-scalable-monorepo-starter",
          },
        },
      },
      null,
      2,
    )}\n`,
  );
  write(
    root,
    "turbo.json",
    `${JSON.stringify({ globalDependencies: ["keep.txt"] }, null, 2)}\n`,
  );
  write(root, "keep.txt", "keep\n");
  write(
    root,
    "marker.md",
    "<!-- >>> APP:web -->\nweb\n<!-- <<< APP:web -->\n",
  );
  write(root, "rename.txt", "starter-name\n");
  write(root, "display.txt", "Starter Name\n");
  write(root, "README.md", "old\n");
  write(
    root,
    "packages/create-scalable-monorepo-starter/src/setup/readme.template.md",
    "# {{displayName}}\n\n{{npmName}}\n\n{{appLines}}\n",
  );
  return { root, manifest };
}

function apply(root: string, manifest: Manifest) {
  const input = {
    rootDir: root,
    manifest,
    selectedApps: ["web"],
    removeExamples: false,
    displayName: "My App",
    npmName: "my-app",
  };
  const plan = buildPlan(input);
  applyPlan({ ...input, plan });
  return plan;
}

function readJson(root: string, relativePath: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("applyPlan", () => {
  it("계획 적용기가 desktop을 선택하지 않았을 때 폴더와 루트 스크립트를 지운다", () => {
    const { root, manifest } = makeTemplate();

    apply(root, manifest);

    const packageJson = readJson(root, "package.json") as {
      name: string;
      version: string;
      scripts: Record<string, string>;
    };
    expect(existsSync(path.join(root, "apps/desktop"))).toBe(false);
    expect(packageJson).toMatchObject({ name: "my-app", version: "0.1.0" });
    expect(packageJson.scripts).toEqual({ "dev:web": "web" });
  });

  it("계획 적용기가 워크스페이스를 지울 때 lock의 경로와 중첩 키를 지운다", () => {
    const { root, manifest } = makeTemplate();

    apply(root, manifest);

    const lock = readJson(root, "package-lock.json") as {
      name: string;
      packages: Record<string, unknown>;
    };
    expect(lock.name).toBe("my-app");
    expect(lock.packages[""]).toMatchObject({ name: "my-app" });
    expect(Object.keys(lock.packages)).not.toContain("apps/desktop");
    expect(Object.keys(lock.packages)).not.toContain(
      "apps/desktop/node_modules/optional",
    );
  });

  it("계획 적용기가 링크 키 이름이 달라도 resolved 경로로 찾아 지운다", () => {
    const { root, manifest } = makeTemplate();

    apply(root, manifest);

    const lock = readJson(root, "package-lock.json") as {
      packages: Record<string, unknown>;
    };
    expect(lock.packages["node_modules/desktop-alias"]).toBeUndefined();
  });

  it("계획 적용기가 lock의 실제 링크가 아닌 resolved 항목을 만날 때 유지한다", () => {
    const { root, manifest } = makeTemplate();
    const lock = readJson(root, "package-lock.json") as {
      packages: Record<string, unknown>;
    };
    Object.assign(lock.packages, {
      "node_modules/not-link": { link: false, resolved: "apps/desktop" },
      "node_modules/no-resolved": { link: true },
      "node_modules/non-string-resolved": { link: true, resolved: null },
      "node_modules/kept-link": { link: true, resolved: "apps/web" },
      "node_modules/null-entry": null,
      "node_modules/string-entry": "apps/desktop",
    });
    write(root, "package-lock.json", `${JSON.stringify(lock, null, 2)}\n`);

    apply(root, manifest);

    const packages = (
      readJson(root, "package-lock.json") as {
        packages: Record<string, unknown>;
      }
    ).packages;
    expect(packages).toMatchObject({
      "node_modules/not-link": { link: false, resolved: "apps/desktop" },
      "node_modules/no-resolved": { link: true },
      "node_modules/non-string-resolved": { link: true, resolved: null },
      "node_modules/kept-link": { link: true, resolved: "apps/web" },
      "node_modules/null-entry": null,
      "node_modules/string-entry": "apps/desktop",
    });
  });

  it("계획 적용기가 templateOnly 워크스페이스를 지울 때 관련 lock 키도 지운다", () => {
    const { root, manifest } = makeTemplate();

    apply(root, manifest);

    const lock = readJson(root, "package-lock.json") as {
      packages: Record<string, unknown>;
    };
    expect(Object.keys(lock.packages)).not.toEqual(
      expect.arrayContaining([
        "packages/create-scalable-monorepo-starter",
        "packages/create-scalable-monorepo-starter/node_modules/tool",
        "node_modules/create-tool",
      ]),
    );
  });

  it("계획 적용기가 텍스트 편집을 적용할 때 마커와 이름을 반영하고 README를 덮어쓴다", () => {
    const { root, manifest } = makeTemplate();

    apply(root, manifest);

    expect(readFileSync(path.join(root, "marker.md"), "utf8")).toBe("web\n");
    expect(readFileSync(path.join(root, "rename.txt"), "utf8")).toBe(
      "my-app\n",
    );
    expect(readFileSync(path.join(root, "display.txt"), "utf8")).toBe(
      "My App\n",
    );
    expect(readFileSync(path.join(root, "README.md"), "utf8")).toContain(
      "# My App",
    );
  });

  it("계획 적용기가 turbo의 삭제 경로 의존성을 만날 때 와일드카드는 남기고 삭제 경로만 뺀다", () => {
    const { root, manifest } = makeTemplate();
    write(
      root,
      "turbo.json",
      `${JSON.stringify(
        {
          globalDependencies: [
            "apps/desktop/.env",
            "apps/*/.env",
            "keep.txt",
          ],
        },
        null,
        2,
      )}\n`,
    );

    apply(root, manifest);

    expect(readJson(root, "turbo.json")).toEqual({
      globalDependencies: ["apps/*/.env", "keep.txt"],
    });
  });

  it("계획 적용기가 지울 경로에 이름 치환 파일이 있을 때 삭제 뒤 파일을 남기지 않는다", () => {
    const { root, manifest } = makeTemplate();
    manifest.apps[1].paths.push(".claude/rules/tailwind-v4.md");
    manifest.rename.npmNameFiles.push(".claude/rules");
    write(root, ".claude/rules/tailwind-v4.md", "starter-name\n");

    apply(root, manifest);

    expect(existsSync(path.join(root, ".claude/rules/tailwind-v4.md"))).toBe(
      false,
    );
  });

  it("계획 적용기가 없는 삭제 경로를 만날 때 건너뛰고 계속한다", () => {
    const { root, manifest } = makeTemplate();
    rmSync(path.join(root, "apps/desktop"), { recursive: true });

    expect(() => apply(root, manifest)).not.toThrow();
  });

  it("계획 적용기가 symlink 삭제 경로를 만날 때 링크 대상은 지우지 않는다", () => {
    const { root, manifest } = makeTemplate();
    rmSync(path.join(root, "apps/desktop"), { recursive: true });
    write(root, "outside/keep.txt", "keep\n");
    symlinkSync("../outside", path.join(root, "apps/desktop"));

    apply(root, manifest);

    expect(existsSync(path.join(root, "apps/desktop"))).toBe(false);
    expect(readFileSync(path.join(root, "outside/keep.txt"), "utf8")).toBe(
      "keep\n",
    );
  });

  it("계획 적용기가 node_modules 없는 폴더에서 실행될 때 외부 모듈 없이 끝난다", () => {
    const { root, manifest } = makeTemplate();

    expect(existsSync(path.join(root, "node_modules"))).toBe(false);
    expect(() => apply(root, manifest)).not.toThrow();
  });

  it("계획 적용기가 JSON을 편집할 때 입력 객체를 바꾸지 않는다", () => {
    const { root, manifest } = makeTemplate();
    const before = structuredClone(manifest);

    apply(root, manifest);

    expect(manifest).toEqual(before);
  });
});
