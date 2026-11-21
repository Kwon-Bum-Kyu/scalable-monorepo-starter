import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { cleanupFakeTemplates, createFakeTemplate } from "../helpers/fakeTemplate";
import {
  cleanupTempDirs,
  isAlive,
  killQuietly,
  makeFakeBin,
  makeTempDir,
  pathWith,
  runCli,
  spawnCli,
  waitForPid,
} from "../helpers/runCli";

const CANCEL_TEXT = "취소했습니다. 만든 파일은 없습니다.";
const SETUP_ENTRY = "packages/create-scalable-monorepo-starter/src/setup/run.mjs";
const QUIET = ["--yes", "--no-install", "--no-git"];

afterEach(() => {
  cleanupFakeTemplates();
  cleanupTempDirs();
});

/** 실행 시 지정한 파일에 자기 pid를 쓰고 멈추거나 실패하는 setup으로 바꾼다. */
function replaceSetup(root: string, body: string): void {
  writeFileSync(path.join(root, SETUP_ENTRY), body);
}

describe("CLI 입력 오류 (종료 코드 1, 첫 줄 없음)", () => {
  async function expectInputError(args: string[], message: string, cwd = makeTempDir()) {
    const result = await runCli(args, { cwd });

    expect(result.code).toBe(1);
    expect(result.stderr).toContain(message);
    expect(result.stdout).toBe("");
    expect(readdirSync(cwd).filter((name) => name.includes(".tmp-"))).toEqual([]);
  }

  it("--apps 값이 비어 있을 때 첫 줄 없이 앱 선택 오류와 종료 코드 1로 끝난다", async () => {
    await expectInputError(["x", "--apps", ""], "앱을 하나 이상 선택해야 합니다.");
  });

  it("알 수 없는 앱 id일 때 선택할 수 있는 앱을 알리고 종료 코드 1로 끝난다", async () => {
    await expectInputError(
      ["demo", "--apps", "mobile", "--yes"],
      "알 수 없는 앱입니다: mobile. 선택할 수 있는 앱: api, web, desktop, storybook",
    );
  });

  it("알 수 없는 플래그일 때 두 줄 오류와 종료 코드 1로 끝난다", async () => {
    await expectInputError(
      ["demo", "--foo"],
      "알 수 없는 옵션입니다: --foo\n사용할 수 있는 옵션은 --help 로 확인해 주세요.\n",
    );
  });

  it("위치 인자가 둘일 때 종료 코드 1로 끝난다", async () => {
    await expectInputError(["a", "b"], "프로젝트 이름은 하나만 지정해 주세요.\n");
  });

  it("examples 플래그가 충돌할 때 종료 코드 1로 끝난다", async () => {
    await expectInputError(
      ["demo", "--remove-examples", "--keep-examples"],
      "--remove-examples 와 --keep-examples 는 함께 쓸 수 없습니다.\n",
    );
  });

  it("이름 없이 --yes만 주었을 때 터미널이 아니면 종료 코드 1로 끝난다", async () => {
    await expectInputError(
      ["--yes"],
      "대화형으로 실행할 수 없는 환경입니다.\n프로젝트 이름을 지정하고, --apps 를 지정하거나 --yes 를 붙여 주세요.\n",
    );
  });

  it("대상 폴더가 비어 있지 않을 때 건드리지 않고 종료 코드 1로 끝난다", async () => {
    const cwd = makeTempDir();
    mkdirSync(path.join(cwd, "demo"));
    writeFileSync(path.join(cwd, "demo/mine.txt"), "mine");

    await expectInputError(
      ["demo", "--apps", "web", ...QUIET],
      '"demo" 폴더가 이미 있고 비어 있지 않습니다. 다른 이름으로 다시 실행해 주세요.\n',
      cwd,
    );

    expect(readdirSync(path.join(cwd, "demo"))).toEqual(["mine.txt"]);
  });
});

describe("CLI 실행 중 실패", () => {
  it("setup이 실패했을 때 setup 출력을 보이고 임시 폴더가 지워지고 대상 폴더가 생기지 않는다", async () => {
    const { root } = createFakeTemplate();
    replaceSetup(root, 'process.stderr.write("setup 고장\\n"); process.exit(1);\n');
    const cwd = makeTempDir();

    const result = await runCli(["demo", "--apps", "web", ...QUIET], {
      cwd,
      env: { STARTER_TEMPLATE_DIR: root },
    });

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("setup 고장");
    expect(readdirSync(cwd)).toEqual([]);
    expect(result.stdout).not.toContain("완료했습니다.");
  });

  it("템플릿 폴더가 없을 때 원인을 알리고 임시 폴더를 지우고 종료 코드 1로 끝난다", async () => {
    const cwd = makeTempDir();

    const result = await runCli(["demo", "--apps", "web", ...QUIET], {
      cwd,
      env: { STARTER_TEMPLATE_DIR: path.join(cwd, "없는-템플릿") },
    });

    expect(result.code).toBe(1);
    expect(result.stderr).not.toBe("");
    expect(readdirSync(cwd)).toEqual([]);
  });

  it("설치가 실패했을 때 폴더를 남기고 종료 코드 1이며 git 단계와 완료 안내가 없다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();
    const bin = makeFakeBin({
      npm: 'echo "npm error boom" >&2; exit 1',
      git: 'echo git-called > "$GIT_MARK"; exit 0',
    });
    const mark = path.join(cwd, "git-mark.txt");

    const result = await runCli(["demo", "--apps", "web", "--yes"], {
      cwd,
      env: {
        STARTER_TEMPLATE_DIR: root,
        PATH: pathWith(bin),
        GIT_MARK: mark,
      },
    });

    expect(result.code).toBe(1);
    expect(existsSync(path.join(cwd, "demo/package.json"))).toBe(true);
    expect(result.stderr).toContain("npm error boom");
    expect(result.stderr).toContain(
      "의존성 설치에 실패했습니다. cd demo 후 npm install 을 다시 실행해 주세요.",
    );
    expect(existsSync(mark)).toBe(false);
    expect(result.stdout).not.toContain("완료했습니다.");
    expect(result.stdout).not.toContain("git 저장소를 만들었습니다");
  });

  it("설치와 git이 성공했을 때 모든 진행 줄과 완료 안내가 나오고 종료 코드가 0이다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();
    const bin = makeFakeBin({ npm: "exit 0", git: "exit 0" });

    const result = await runCli(["demo", "--apps", "web", "--yes"], {
      cwd,
      env: { STARTER_TEMPLATE_DIR: root, PATH: pathWith(bin) },
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain("◇  의존성을 설치했습니다");
    expect(result.stdout).toContain("◇  git 저장소를 만들었습니다");
    expect(result.stdout).toContain("완료했습니다.");
    expect(result.stdout).not.toContain("  npm install\n");
  });

  it("git이 실패했을 때 경고만 보이고 완료 안내까지 이어지며 종료 코드가 0이다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();
    const bin = makeFakeBin({ npm: "exit 0", git: "exit 1" });

    const result = await runCli(["demo", "--apps", "web", "--yes"], {
      cwd,
      env: { STARTER_TEMPLATE_DIR: root, PATH: pathWith(bin) },
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain(
      "git 저장소를 만들지 못했습니다. 필요하면 직접 git init 을 실행해 주세요.",
    );
    expect(result.stdout).toContain("완료했습니다.");
  });
});

describe("CLI 진행 중 SIGINT", () => {
  it("진행 중 Ctrl+C일 때 취소 문장을 보이고 임시 폴더가 지워지고 종료 코드가 130이다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();
    const ready = path.join(makeTempDir("cli-ready-"), "ready.txt");
    replaceSetup(
      root,
      `import { writeFileSync } from "node:fs";
writeFileSync(process.env.READY_FILE, String(process.pid));
setTimeout(() => process.exit(0), 30000);
`,
    );
    const { child, done } = spawnCli(["demo", "--apps", "web", ...QUIET], {
      cwd,
      env: { STARTER_TEMPLATE_DIR: root, READY_FILE: ready },
    });

    const setupPid = await waitForPid(ready);
    child.kill("SIGINT");
    const result = await done;
    const setupAlive = isAlive(setupPid);
    killQuietly(setupPid);

    expect(setupAlive).toBe(false);
    expect(result.code).toBe(130);
    expect(result.stdout).toContain(CANCEL_TEXT);
    expect(result.stdout).not.toContain("Canceled");
    expect(readdirSync(cwd)).toEqual([]);
  });

  it("설치 중 Ctrl+C일 때 CLI가 끝난 시점에 npm 프로세스가 이미 종료되어 있다", async () => {
    const { root } = createFakeTemplate();
    const cwd = makeTempDir();
    const ready = path.join(makeTempDir("cli-ready-"), "npm-pid.txt");
    const bin = makeFakeBin({
      npm: `trap 'sleep 1; exit 0' TERM
echo $$ > "$READY_FILE"
while :; do sleep 0.1; done`,
    });
    const { child, done } = spawnCli(["demo", "--apps", "web", "--yes", "--no-git"], {
      cwd,
      env: { STARTER_TEMPLATE_DIR: root, PATH: pathWith(bin), READY_FILE: ready },
    });

    const npmPid = await waitForPid(ready);
    child.kill("SIGINT");
    const result = await done;
    const npmAlive = isAlive(npmPid);
    killQuietly(npmPid);

    expect(npmAlive).toBe(false);
    expect(result.code).toBe(1);
    expect(existsSync(path.join(cwd, "demo/package.json"))).toBe(true);
  });
});
