import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchTemplate } from "../../../src/cli/fetchTemplate.mjs";

const pkg = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../../../package.json", import.meta.url)),
    "utf8",
  ),
) as { version: string };

const REPO = "Kwon-Bum-Kyu/scalable-monorepo-starter";
const TAG_MISSING_MESSAGE = `Failed to download https://api.github.com/repos/${REPO}/tarball/v9.9.9: 404 Not Found`;
const NETWORK_MESSAGE = `Failed to download https://api.github.com/repos/${REPO}/tarball/v9.9.9: TypeError: fetch failed`;

let root: string;
let dest: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "fetch-template-"));
  dest = join(root, "dest");
  mkdirSync(dest);
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => !entry.isDirectory())
    .map((entry) => join(entry.parentPath, entry.name).slice(dir.length + 1))
    .sort();
}

describe("fetchTemplate 내려받기", () => {
  it("자기 버전이 package.json의 값일 때 그 버전의 태그를 github 접두로 받는다", async () => {
    const download = vi.fn().mockResolvedValue({});

    const result = await fetchTemplate({ destDir: dest, env: {}, download });

    expect(download).toHaveBeenCalledTimes(1);
    expect(download.mock.calls[0][0]).toBe(`github:${REPO}#v${pkg.version}`);
    expect(download.mock.calls[0][1]).toMatchObject({ dir: dest });
    expect(download.mock.calls[0][1]).not.toHaveProperty("force");
    expect(download.mock.calls[0][1]).not.toHaveProperty("forceClean");
    expect(result).toEqual({ ref: `v${pkg.version}`, devLine: null });
  });

  it("STARTER_TEMPLATE_REF가 있을 때 그 ref를 받고 개발용 템플릿 줄을 돌려준다", async () => {
    const download = vi.fn().mockResolvedValue({});

    const result = await fetchTemplate({
      destDir: dest,
      env: { STARTER_TEMPLATE_REF: "main" },
      download,
    });

    expect(download.mock.calls[0][0]).toBe(`github:${REPO}#main`);
    expect(result).toEqual({
      ref: "main",
      devLine: "개발용 템플릿을 사용합니다: main",
    });
  });

  it("태그가 없을 때 태그 없음 사유로 실패한다", async () => {
    const download = vi.fn().mockRejectedValue(new Error(TAG_MISSING_MESSAGE));

    await expect(
      fetchTemplate({ destDir: dest, env: {}, download }),
    ).rejects.toMatchObject({
      reason: "tag-missing",
      ref: `v${pkg.version}`,
      detail: TAG_MISSING_MESSAGE,
    });
  });

  it("네트워크 오류일 때 원인 메시지를 담아 실패한다", async () => {
    const error = Object.assign(new Error(NETWORK_MESSAGE), {
      cause: new TypeError("fetch failed"),
    });
    const download = vi.fn().mockRejectedValue(error);

    await expect(
      fetchTemplate({ destDir: dest, env: {}, download }),
    ).rejects.toMatchObject({ reason: "network", detail: NETWORK_MESSAGE });
  });

  it("404 문장이어도 cause가 있으면 태그 없음으로 보지 않는다", async () => {
    const error = Object.assign(new Error(TAG_MISSING_MESSAGE), {
      cause: new Error("x"),
    });
    const download = vi.fn().mockRejectedValue(error);

    await expect(
      fetchTemplate({ destDir: dest, env: {}, download }),
    ).rejects.toMatchObject({ reason: "network" });
  });

  it("분류할 수 없는 오류일 때 네트워크 사유로 원인 메시지를 담아 실패한다", async () => {
    const download = vi.fn().mockRejectedValue(new Error("Failed to download x: 403 Forbidden"));

    await expect(
      fetchTemplate({ destDir: dest, env: {}, download }),
    ).rejects.toMatchObject({
      reason: "network",
      detail: "Failed to download x: 403 Forbidden",
    });
  });
});

describe("fetchTemplate STARTER_TEMPLATE_DIR", () => {
  it("git 작업 트리일 때 git이 추적하는 파일만 복사한다", async () => {
    const src = join(root, "src-repo");
    mkdirSync(join(src, "apps"), { recursive: true });
    writeFileSync(join(src, "package.json"), "{}");
    writeFileSync(join(src, "apps", "a.ts"), "a");
    writeFileSync(join(src, ".gitignore"), ".env\n");
    writeFileSync(join(src, ".env"), "SECRET=1");
    writeFileSync(join(src, "untracked.txt"), "u");
    symlinkSync("/etc/hosts", join(src, "outside-link"));
    execFileSync("git", ["init", "-q"], { cwd: src });
    execFileSync("git", ["add", "package.json", "apps", ".gitignore"], {
      cwd: src,
    });
    const download = vi.fn();

    const result = await fetchTemplate({
      destDir: dest,
      env: { STARTER_TEMPLATE_DIR: src },
      download,
    });

    expect(listFiles(dest)).toEqual([".gitignore", "apps/a.ts", "package.json"]);
    expect(download).not.toHaveBeenCalled();
    expect(result.devLine).toBe(`개발용 템플릿을 사용합니다: ${src}`);
  });

  it(".git이 없을 때 node_modules와 빌드 산출물을 뺀 전부를 복사한다", async () => {
    const src = join(root, "src-plain");
    for (const dir of ["src", "node_modules/x", "dist", "apps/web/dist"]) {
      mkdirSync(join(src, dir), { recursive: true });
    }
    writeFileSync(join(src, "src", "a.ts"), "a");
    writeFileSync(join(src, ".env.example"), "E=");
    writeFileSync(join(src, "node_modules", "x", "i.js"), "x");
    writeFileSync(join(src, "dist", "o.js"), "o");
    writeFileSync(join(src, "apps", "web", "dist", "o.js"), "o");
    writeFileSync(join(src, "apps", "web", "keep.ts"), "k");

    await fetchTemplate({
      destDir: dest,
      env: { STARTER_TEMPLATE_DIR: src },
      download: vi.fn(),
    });

    expect(listFiles(dest)).toEqual([
      ".env.example",
      "apps/web/keep.ts",
      "src/a.ts",
    ]);
    expect(existsSync(join(dest, "node_modules"))).toBe(false);
  });

  it("DIR와 REF가 함께 있을 때 DIR을 복사하고 내려받지 않는다", async () => {
    const src = join(root, "src-both");
    mkdirSync(src);
    writeFileSync(join(src, "a.txt"), "a");
    const download = vi.fn();

    await fetchTemplate({
      destDir: dest,
      env: { STARTER_TEMPLATE_DIR: src, STARTER_TEMPLATE_REF: "main" },
      download,
    });

    expect(download).not.toHaveBeenCalled();
    expect(listFiles(dest)).toEqual(["a.txt"]);
  });
});
