import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import * as clack from "@clack/prompts";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchTemplate,FetchTemplateError } from "../../src/cli/fetchTemplate.mjs";
import { main } from "../../src/cli/index.mjs";
import { readManifest } from "../../src/setup/manifest.mjs";
import { cleanupFakeTemplates, createFakeTemplate } from "../helpers/fakeTemplate";
import { cleanupTempDirs, makeTempDir, runCli } from "../helpers/runCli";

const pkg = JSON.parse(
  readFileSync(path.join(__dirname, "../../package.json"), "utf8"),
) as { version: string };
const CANCEL_TEXT = "취소했습니다. 만든 파일은 없습니다.";

afterEach(() => {
  cleanupFakeTemplates();
  cleanupTempDirs();
  vi.restoreAllMocks();
});

function leftovers(cwd: string): string[] {
  return readdirSync(cwd).filter((name) => name.includes(".tmp-"));
}

describe("CLI 비대화형 실행", () => {
  it("이름과 앱과 플래그만 줄 때 질문 없이 생성이 끝나고 종료 코드가 0이다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();

    const result = await runCli(
      ["demo-app", "--apps", "web", "--yes", "--no-install", "--no-git"],
      { cwd, env: { STARTER_TEMPLATE_DIR: root } },
    );

    expect(result.code).toBe(0);
    const created = JSON.parse(readFileSync(path.join(cwd, "demo-app/package.json"), "utf8"));
    expect(created.name).toBe("demo-app");
    expect(existsSync(path.join(cwd, "demo-app/apps/api"))).toBe(false);
    expect(leftovers(cwd)).toEqual([]);
    expect(result.stdout).toContain(`┌  scalable-monorepo-starter v${pkg.version}`);
    expect(result.stdout).toContain(`◇  템플릿을 내려받았습니다 (v${pkg.version})`);
    expect(result.stdout).toContain("◇  프로젝트 이름을 반영했습니다 (demo-app)");
    expect(result.stdout).toContain("완료했습니다.");
    expect(result.stdout).toContain("  cd demo-app\n  npm install\n");
    expect(result.stdout).toContain("npm run dev:web");
  });

  it("터미널이 아닐 때 진행 줄이 회전 표시와 제어 문자 없이 평문 한 줄씩 나온다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();

    const result = await runCli(
      ["demo-app", "--apps", "web", "--yes", "--no-install", "--no-git"],
      { cwd, env: { STARTER_TEMPLATE_DIR: root } },
    );

    expect(result.stdout.includes("\u001b")).toBe(false);
    expect(result.stdout).not.toMatch(/[◒◐◓◑]/u);
    const progress = result.stdout.split("\n").filter((line) => line.startsWith("◇  "));
    expect(progress.length).toBeGreaterThanOrEqual(3);
  });

  it("개발용 템플릿 환경 변수가 있을 때 첫 줄 아래에 개발용 템플릿을 쓴다는 줄이 나온다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();

    const { stdout } = await runCli(
      ["demo-app", "--apps", "web", "--yes", "--no-install", "--no-git"],
      { cwd, env: { STARTER_TEMPLATE_DIR: root } },
    );

    const lines = stdout.split("\n");
    const first = lines.findIndex((line) => line.startsWith("┌  "));
    const dev = lines.findIndex((line) => line.includes(`개발용 템플릿을 사용합니다: ${root}`));
    expect(first).toBeGreaterThanOrEqual(0);
    expect(dev).toBeGreaterThan(first);
  });

  it("--help일 때 종료 코드가 0이고 첫 줄 없이 도움말만 나온다", async () => {
    const result = await runCli(["--help"], { cwd: makeTempDir() });

    expect(result.code).toBe(0);
    expect(result.stdout.startsWith("사용법\n")).toBe(true);
    expect(result.stdout).not.toContain("┌");
    expect(result.stdout).toContain("--apps <id,...>");
  });

  it("storybook만 줄 때 web을 함께 설치한다는 안내가 한 번 나온다", async () => {
    const repoRoot = path.resolve(__dirname, "../../../..");

    const result = await runCli(["demo-app", "--apps", "storybook", "--yes", "--dry-run"], {
      cwd: makeTempDir(),
      env: { STARTER_TEMPLATE_DIR: repoRoot },
    });

    expect(result.code).toBe(0);
    const notice = "storybook은 web이 필요해서 web을 함께 설치합니다.";
    expect(result.stdout.split(notice)).toHaveLength(2);
  });

  it("stdout만 터미널이고 stdin이 터미널이 아닐 때 질문 없이 비대화형 오류로 끝난다", async () => {
    const errors: string[] = [];
    vi.spyOn(process.stderr, "write").mockImplementation((chunk: string | Uint8Array) => {
      errors.push(String(chunk));
      return true;
    });
    const stdoutTTY = Object.getOwnPropertyDescriptor(process.stdout, "isTTY");
    const stdinTTY = Object.getOwnPropertyDescriptor(process.stdin, "isTTY");
    Object.defineProperty(process.stdout, "isTTY", { value: true, configurable: true });
    Object.defineProperty(process.stdin, "isTTY", { value: false, configurable: true });
    try {
      const code = await main({ argv: [], env: {}, cwd: makeTempDir() });

      expect(code).toBe(1);
      expect(errors.join("")).toContain("대화형으로 실행할 수 없는 환경입니다.");
    } finally {
      if (stdoutTTY) Object.defineProperty(process.stdout, "isTTY", stdoutTTY);
      else delete (process.stdout as { isTTY?: boolean }).isTTY;
      if (stdinTTY) Object.defineProperty(process.stdin, "isTTY", stdinTTY);
      else delete (process.stdin as { isTTY?: boolean }).isTTY;
    }
  });

  it("--version일 때 종료 코드가 0이고 버전만 나온다", async () => {
    const result = await runCli(["--version"], { cwd: makeTempDir() });

    expect(result.code).toBe(0);
    expect(result.stdout).toBe(`${pkg.version}\n`);
  });

  it("--dry-run일 때 대상 폴더가 만들어지지 않고 종료 코드가 0이다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();

    const result = await runCli(
      ["demo-app", "--apps", "web", "--yes", "--dry-run"],
      { cwd, env: { STARTER_TEMPLATE_DIR: root } },
    );

    expect(result.code).toBe(0);
    expect(readdirSync(cwd)).toEqual([]);
    expect(result.stdout).toContain("[dry-run] 지울 경로");
    const notice = result.stdout.indexOf("변경 계획입니다. 파일은 바꾸지 않습니다.");
    expect(notice).toBeGreaterThan(result.stdout.indexOf("템플릿을 내려받았습니다"));
    expect(notice).toBeLessThan(result.stdout.indexOf("[dry-run] 지울 경로"));
    expect(result.stdout).toContain("계획만 출력했습니다. demo-app 폴더는 만들지 않았습니다.");
    expect(result.stdout).not.toContain("완료했습니다.");
  });
});

function fakePrompts(answers: { name?: unknown; apps?: unknown; examples?: unknown }) {
  const calls: string[] = [];
  const cancelSymbol = Symbol("cancel");
  const answer = (kind: string, value: unknown) => async () => {
    calls.push(kind);
    return value === "CANCEL" ? cancelSymbol : value;
  };
  const prompts: typeof clack = {
    ...clack,
    text: answer("text", answers.name) as typeof clack.text,
    multiselect: answer("multiselect", answers.apps) as typeof clack.multiselect,
    select: answer("select", answers.examples) as typeof clack.select,
    isCancel: ((value: unknown) => value === cancelSymbol) as unknown as typeof clack.isCancel,
    spinner: (() => ({ start() {}, stop() {}, cancel() {}, clear() {}, error() {} })) as unknown as typeof clack.spinner,
  };
  return { prompts, calls };
}

function captureStdout() {
  const chunks: string[] = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
    chunks.push(String(chunk));
    return true;
  });
  return () => chunks.join("");
}

describe("CLI 대화형 흐름 (프롬프트 주입)", () => {
  it("질문이 모두 끝나기 전에는 내려받지 않고 내려받기는 한 번만 일어난다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();
    const { prompts, calls } = fakePrompts({
      name: "My Shop",
      apps: ["api", "web"],
      examples: "remove",
    });
    const fetched: string[] = [];
    captureStdout();

    const code = await main({
      argv: ["--no-install", "--no-git"],
      env: { STARTER_TEMPLATE_DIR: root },
      cwd,
      isTTY: true,
      prompts,
      fetch: async (options: Parameters<typeof fetchTemplate>[0]) => {
        fetched.push(`fetch-after-${calls.join(",")}`);
        return fetchTemplate(options);
      },
    });

    expect(code).toBe(0);
    expect(fetched).toEqual(["fetch-after-text,multiselect,select"]);
    expect(existsSync(path.join(cwd, "my-shop/package.json"))).toBe(true);
    expect(existsSync(path.join(cwd, "my-shop/example.txt"))).toBe(false);
  });

  it("이름 질문에서 취소할 때 내려받지 않고 취소 문장과 종료 코드 130으로 끝난다", async () => {
    const cwd = makeTempDir();
    const { prompts } = fakePrompts({ name: "CANCEL" });
    const fetch = vi.fn();
    const output = captureStdout();

    const code = await main({ argv: [], env: {}, cwd, isTTY: true, prompts, fetch });

    expect(code).toBe(130);
    expect(fetch).not.toHaveBeenCalled();
    expect(output()).toContain(CANCEL_TEXT);
    expect(readdirSync(cwd)).toEqual([]);
  });

  it("앱 선택에서 취소할 때 내려받지 않고 종료 코드 130으로 끝난다", async () => {
    const cwd = makeTempDir();
    const { prompts } = fakePrompts({ name: "demo", apps: "CANCEL" });
    const fetch = vi.fn();
    captureStdout();

    const code = await main({ argv: [], env: {}, cwd, isTTY: true, prompts, fetch });

    expect(code).toBe(130);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("examples 질문에서 취소할 때 내려받지 않고 종료 코드 130으로 끝난다", async () => {
    const cwd = makeTempDir();
    const { prompts } = fakePrompts({ name: "demo", apps: ["api", "web"], examples: "CANCEL" });
    const fetch = vi.fn();
    captureStdout();

    const code = await main({ argv: [], env: {}, cwd, isTTY: true, prompts, fetch });

    expect(code).toBe(130);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("터미널에서 --yes만 줄 때 이름만 묻고 앱과 examples는 기본값으로 진행한다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();
    const { prompts, calls } = fakePrompts({ name: "demo" });
    captureStdout();

    const code = await main({
      argv: ["--yes", "--no-install", "--no-git"],
      env: { STARTER_TEMPLATE_DIR: root },
      cwd,
      isTTY: true,
      prompts,
    });

    const defaults = readManifest().apps.filter((app) => app.default).map((app) => app.id);
    expect(code).toBe(0);
    expect(calls).toEqual(["text"]);
    for (const id of defaults) {
      expect(existsSync(path.join(cwd, `demo/apps/${id}`))).toBe(true);
    }
  });
});

describe("CLI 내려받기 실패 (주입한 fetch)", () => {
  it("네트워크가 실패했을 때 두 줄 오류를 stderr에 보이고 폴더를 남기지 않고 종료 코드 1로 끝난다", async () => {
    const cwd = makeTempDir();
    const errors: string[] = [];
    captureStdout();
    vi.spyOn(process.stderr, "write").mockImplementation((chunk: string | Uint8Array) => {
      errors.push(String(chunk));
      return true;
    });

    const code = await main({
      argv: ["demo", "--apps", "web", "--yes", "--no-install", "--no-git"],
      env: {},
      cwd,
      isTTY: true,
      prompts: fakePrompts({}).prompts,
      fetch: async () => {
        throw new FetchTemplateError("network", "v1.2.0", "fetch failed");
      },
    });

    expect(code).toBe(1);
    expect(errors.join("")).toBe(
      "템플릿을 내려받지 못했습니다. 네트워크 연결을 확인한 뒤 다시 실행해 주세요.\n원인: fetch failed\n",
    );
    expect(readdirSync(cwd)).toEqual([]);
  });
});
