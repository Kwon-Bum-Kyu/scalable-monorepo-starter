import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

interface PackageJson {
  bin?: Record<string, string>;
  files?: string[];
  engines?: { node?: string };
  license?: string;
  dependencies?: Record<string, string>;
  repository?: { type?: string; url?: string; directory?: string };
}

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);
const CLI_DIR = path.join(REPO_ROOT, "packages/create-scalable-monorepo-starter");
const RUNTIME_DEPENDENCIES = ["@clack/prompts", "giget"];
const EXACT_VERSION = /^\d+\.\d+\.\d+$/;

function checkFiles(pkg: PackageJson): boolean {
  return pkg.files?.includes("starter.manifest.json") === true;
}

function checkBinShebang(firstLine: string): boolean {
  return firstLine === "#!/usr/bin/env node";
}

function checkDependencyNames(pkg: PackageJson): boolean {
  const names = Object.keys(pkg.dependencies ?? {}).sort();
  return JSON.stringify(names) === JSON.stringify([...RUNTIME_DEPENDENCIES].sort());
}

function checkExactVersions(pkg: PackageJson): boolean {
  return Object.values(pkg.dependencies ?? {}).every((v) => EXACT_VERSION.test(v));
}

function checkEngines(pkg: PackageJson, root: PackageJson): boolean {
  return pkg.engines?.node !== undefined && pkg.engines.node === root.engines?.node;
}

function checkLicense(pkg: PackageJson): boolean {
  return pkg.license === "MIT";
}

function checkLicenseText(packageText: string, rootText: string): boolean {
  return packageText === rootText;
}

function readText(file: string): string {
  return readFileSync(file, "utf8");
}

function readJson(file: string): PackageJson {
  return JSON.parse(readText(file));
}

describe("검사 함수 (가짜 입력)", () => {
  it("files에 starter.manifest.json이 없을 때 검사에 실패한다", () => {
    expect(checkFiles({ files: ["src"] })).toBe(false);
    expect(checkFiles({ files: ["src", "starter.manifest.json"] })).toBe(true);
  });

  it("bin 파일 첫 줄이 shebang이 아닐 때 검사에 실패한다", () => {
    expect(checkBinShebang("import x from 'y';")).toBe(false);
    expect(checkBinShebang("#!/usr/bin/env node")).toBe(true);
  });

  it("런타임 의존성이 clack과 giget 둘뿐이 아닐 때 검사에 실패한다", () => {
    expect(checkDependencyNames({ dependencies: { giget: "3.3.1" } })).toBe(false);
    expect(
      checkDependencyNames({
        dependencies: { "@clack/prompts": "1.9.0", giget: "3.3.1", extra: "1.0.0" },
      }),
    ).toBe(false);
    expect(
      checkDependencyNames({
        dependencies: { "@clack/prompts": "1.9.0", giget: "3.3.1" },
      }),
    ).toBe(true);
  });

  it("런타임 의존성의 버전에 범위 기호가 있을 때 검사에 실패한다", () => {
    expect(checkExactVersions({ dependencies: { giget: "^3.3.1" } })).toBe(false);
    expect(checkExactVersions({ dependencies: { giget: "~3.3.1" } })).toBe(false);
    expect(checkExactVersions({ dependencies: { giget: "3.3.1" } })).toBe(true);
  });

  it("engines의 Node 요구가 루트와 다를 때 검사에 실패한다", () => {
    const root = { engines: { node: ">=22.13.0" } };
    expect(checkEngines({ engines: { node: ">=20" } }, root)).toBe(false);
    expect(checkEngines({}, root)).toBe(false);
    expect(checkEngines({ engines: { node: ">=22.13.0" } }, root)).toBe(true);
  });

  it("license가 MIT가 아닐 때 검사에 실패한다", () => {
    expect(checkLicense({ license: "ISC" })).toBe(false);
    expect(checkLicense({ license: "MIT" })).toBe(true);
  });

  it("패키지의 LICENSE가 루트 LICENSE와 다를 때 검사에 실패한다", () => {
    expect(checkLicenseText("MIT License\n", "MIT License\n\nCopyright")).toBe(false);
    expect(checkLicenseText("MIT License\n", "MIT License\n")).toBe(true);
  });
});

describe("실제 패키지 필드", () => {
  const pkg = readJson(path.join(CLI_DIR, "package.json"));
  const root = readJson(path.join(REPO_ROOT, "package.json"));

  it("files가 src와 starter.manifest.json만 포함할 때 검사를 통과한다", () => {
    expect(pkg.files).toEqual(["src", "starter.manifest.json"]);
    expect(checkFiles(pkg)).toBe(true);
  });

  it("런타임 의존성이 clack과 giget 둘뿐일 때 검사를 통과한다", () => {
    expect(checkDependencyNames(pkg)).toBe(true);
  });

  it("런타임 의존성이 정확한 버전으로 고정되어 있을 때 검사를 통과한다", () => {
    expect(pkg.dependencies).toEqual({ "@clack/prompts": "1.9.0", giget: "3.3.1" });
    expect(checkExactVersions(pkg)).toBe(true);
  });

  it("engines의 Node 요구가 루트와 같을 때 검사를 통과한다", () => {
    expect(checkEngines(pkg, root)).toBe(true);
  });

  it("license가 MIT일 때 검사를 통과한다", () => {
    expect(checkLicense(pkg)).toBe(true);
  });

  it("repository가 공개 저장소와 패키지 폴더를 가리킬 때 검사를 통과한다", () => {
    expect(pkg.repository).toEqual({
      type: "git",
      url: "git+https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter.git",
      directory: "packages/create-scalable-monorepo-starter",
    });
  });

  it("bin이 진입점 파일을 가리키고 그 파일 첫 줄이 shebang일 때 검사를 통과한다", () => {
    expect(pkg.bin).toEqual({
      "create-scalable-monorepo-starter": "./src/cli/index.mjs",
    });
    const entry = path.join(CLI_DIR, pkg.bin?.["create-scalable-monorepo-starter"] ?? "");
    expect(existsSync(entry)).toBe(true);
    expect(checkBinShebang(readText(entry).split("\n")[0] ?? "")).toBe(true);
  });

  it("패키지의 LICENSE가 루트 LICENSE와 같을 때 검사를 통과한다", () => {
    expect(
      checkLicenseText(
        readText(path.join(CLI_DIR, "LICENSE")),
        readText(path.join(REPO_ROOT, "LICENSE")),
      ),
    ).toBe(true);
  });
});
