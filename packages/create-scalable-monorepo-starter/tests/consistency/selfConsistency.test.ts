import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import {
  readManifest,
  validateManifest,
} from "../../src/setup/manifest.mjs";
import { stripMarkers } from "../../src/setup/stripMarkers.mjs";

type Manifest = ReturnType<typeof readManifest>;

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);
const CLI_PATH = "packages/create-scalable-monorepo-starter";
const tempDirectories: string[] = [];

function readJson<T>(root: string, relativePath: string): T {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function write(root: string, relativePath: string, content = ""): void {
  const target = path.join(root, relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function isUnder(relativePath: string, parents: string[]): boolean {
  return parents.some(
    (parent) =>
      relativePath === parent || relativePath.startsWith(`${parent}/`),
  );
}

function assertApps(root: string, manifest: Manifest): void {
  const actual = readdirSync(path.join(root, "apps"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const declared = manifest.apps
    .map((app) => path.basename(app.dir))
    .sort();
  expect(actual).toEqual(declared);
}

function manifestPaths(manifest: Manifest): string[] {
  return [
    ...manifest.apps.flatMap((app) => [app.dir, ...app.paths]),
    ...manifest.packages.flatMap((itemPackage) => [
      itemPackage.dir,
      ...itemPackage.paths,
    ]),
    ...manifest.conditionalPaths.map((item) => item.path),
    ...manifest.templateOnly,
    ...manifest.markerFiles,
    ...manifest.rename.npmNameFiles,
    ...manifest.rename.displayNameFiles,
    ...manifest.rename.replacements.map((item) => item.file),
  ];
}

function assertPaths(root: string, manifest: Manifest): void {
  for (const relativePath of manifestPaths(manifest)) {
    expect(existsSync(path.join(root, relativePath)), relativePath).toBe(true);
  }
  for (const replacement of manifest.rename.replacements) {
    expect(
      readFileSync(path.join(root, replacement.file), "utf8"),
      replacement.file,
    ).toContain(replacement.from);
  }
}

function assertRootScripts(root: string, manifest: Manifest): void {
  const packageJson = readJson<{ scripts?: Record<string, string> }>(
    root,
    "package.json",
  );
  for (const script of manifest.apps.flatMap((app) => app.rootScripts)) {
    expect(packageJson.scripts, script).toHaveProperty(script);
  }
}

function assertMarkers(
  root: string,
  manifest: Manifest,
  trackedFiles: string[],
): void {
  const markerFiles = new Set(manifest.markerFiles);
  for (const relativePath of trackedFiles) {
    if (isUnder(relativePath, manifest.templateOnly)) {
      continue;
    }
    const absolutePath = path.join(root, relativePath);
    if (
      existsSync(absolutePath) &&
      !markerFiles.has(relativePath) &&
      readFileSync(absolutePath).includes(Buffer.from("APP:"))
    ) {
      throw new Error(`등록되지 않은 APP 마커 파일: ${relativePath}`);
    }
  }
  const appIds = manifest.apps.map((app) => app.id);
  for (const relativePath of markerFiles) {
    stripMarkers(
      readFileSync(path.join(root, relativePath), "utf8"),
      appIds,
      appIds,
    );
  }
}

function assertVersions(root: string): void {
  const rootPackage = readJson<{ version: string }>(root, "package.json");
  const cliPackage = readJson<{ version: string }>(
    root,
    `${CLI_PATH}/package.json`,
  );
  const lock = readJson<{
    version: string;
    packages: Record<string, { version?: string }>;
  }>(root, "package-lock.json");
  expect([
    cliPackage.version,
    lock.version,
    lock.packages[""]?.version,
    lock.packages[CLI_PATH]?.version,
  ]).toEqual(Array(4).fill(rootPackage.version));
}

function trackedFiles(root: string): string[] {
  return execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
}

function makeMinimalRepository(): { root: string; manifest: Manifest } {
  const root = mkdtempSync(path.join(tmpdir(), "self-consistency-"));
  tempDirectories.push(root);
  const manifest = structuredClone(readManifest());
  for (const app of manifest.apps) {
    mkdirSync(path.join(root, app.dir), { recursive: true });
  }
  for (const markerFile of manifest.markerFiles) {
    write(root, markerFile);
  }
  write(
    root,
    "package.json",
    JSON.stringify({
      version: "1.1.0",
      scripts: Object.fromEntries(
        manifest.apps.flatMap((app) =>
          app.rootScripts.map((script) => [script, script]),
        ),
      ),
    }),
  );
  write(
    root,
    `${CLI_PATH}/package.json`,
    JSON.stringify({ version: "1.1.0" }),
  );
  write(
    root,
    "package-lock.json",
    JSON.stringify({
      version: "1.1.0",
      packages: {
        "": { version: "1.1.0" },
        [CLI_PATH]: { version: "1.1.0" },
      },
    }),
  );
  return { root, manifest };
}

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("starter 자기 일관성", () => {
  it("저장소가 앱 목록을 선언할 때 apps 폴더와 매니페스트가 일치한다", () => {
    expect(() => assertApps(REPO_ROOT, readManifest())).not.toThrow();
  });

  it("저장소에 매니페스트에 없는 앱 폴더가 있을 때 검사에 실패한다", () => {
    const { root, manifest } = makeMinimalRepository();
    mkdirSync(path.join(root, "apps/mobile"));

    expect(() => assertApps(root, manifest)).toThrow();
  });

  it("저장소가 매니페스트 경로를 선언할 때 모든 경로와 치환 원본이 존재한다", () => {
    expect(() => assertPaths(REPO_ROOT, readManifest())).not.toThrow();
  });

  it("저장소의 매니페스트 경로가 없을 때 검사에 실패한다", () => {
    const manifest = structuredClone(readManifest());
    manifest.templateOnly.push("missing-file.txt");

    expect(() => assertPaths(REPO_ROOT, manifest)).toThrow();
  });

  it("저장소가 앱 루트 스크립트를 선언할 때 package.json에 모두 존재한다", () => {
    expect(() => assertRootScripts(REPO_ROOT, readManifest())).not.toThrow();
  });

  it("저장소의 앱 루트 스크립트가 package.json에 없을 때 검사에 실패한다", () => {
    const { root, manifest } = makeMinimalRepository();
    const packageJson = readJson<{ scripts: Record<string, string> }>(
      root,
      "package.json",
    );
    delete packageJson.scripts[manifest.apps[0].rootScripts[0]];
    write(root, "package.json", JSON.stringify(packageJson));

    expect(() => assertRootScripts(root, manifest)).toThrow();
  });

  it("저장소가 APP 마커를 포함할 때 등록 파일 안에서 짝과 앱 id가 맞는다", () => {
    expect(() =>
      assertMarkers(REPO_ROOT, readManifest(), trackedFiles(REPO_ROOT)),
    ).not.toThrow();
  });

  it("저장소의 templateOnly 밖 미등록 파일에 APP 마커가 있을 때 검사에 실패한다", () => {
    const { root, manifest } = makeMinimalRepository();
    write(root, "unexpected.md", "<!-- APP:web -->\n");

    expect(() =>
      assertMarkers(root, manifest, ["unexpected.md"]),
    ).toThrow("unexpected.md");
  });

  it("저장소의 templateOnly 아래 파일에 APP 문자열이 있을 때 검사 대상이 아니다", () => {
    const { root, manifest } = makeMinimalRepository();
    const file = `${CLI_PATH}/marker-example.txt`;
    write(root, file, "APP:unknown\n");

    expect(() => assertMarkers(root, manifest, [file])).not.toThrow();
  });

  it("저장소가 버전을 기록할 때 루트와 CLI와 lock의 네 값이 일치한다", () => {
    expect(() => assertVersions(REPO_ROOT)).not.toThrow();
  });

  it("저장소의 루트와 CLI 버전이 다를 때 검사에 실패한다", () => {
    const { root } = makeMinimalRepository();
    write(root, "package.json", JSON.stringify({ version: "1.2.0" }));

    expect(() => assertVersions(root)).toThrow();
  });

  it("저장소의 package-lock 버전이 다를 때 검사에 실패한다", () => {
    const { root } = makeMinimalRepository();
    const lock = readJson<{
      version: string;
      packages: Record<string, { version: string }>;
    }>(root, "package-lock.json");
    lock.packages[CLI_PATH].version = "1.2.0";
    write(root, "package-lock.json", JSON.stringify(lock));

    expect(() => assertVersions(root)).toThrow();
  });

  it("저장소가 앱 개발 정보를 선언할 때 url과 note 중 하나만 값이다", () => {
    expect(() => validateManifest(readManifest())).not.toThrow();
  });

  it("저장소의 앱 개발 정보에 url과 note가 모두 있을 때 검사에 실패한다", () => {
    const manifest = structuredClone(readManifest());
    manifest.apps[0].dev.note = "중복 설명";

    expect(() => validateManifest(manifest)).toThrow(
      "dev.url과 dev.note 중 하나만",
    );
  });
});
