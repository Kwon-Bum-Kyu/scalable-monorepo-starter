import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { runSetup } from "../../src/setup/run.mjs";
import {
  cleanupFakeTemplates,
  createFakeTemplate,
} from "../helpers/fakeTemplate";

function run(
  root: string,
  args: string[],
  options: { npm?: boolean } = {},
) {
  return options.npm
    ? spawnSync("npm", ["run", "setup", "--", ...args], {
        cwd: root,
        encoding: "utf8",
      })
    : spawnSync(
        process.execPath,
        [
          path.join(
            root,
            "packages/create-scalable-monorepo-starter/src/setup/run.mjs",
          ),
          ...args,
        ],
        { cwd: root, encoding: "utf8" },
      );
}

function snapshot(root: string, relativePath = ""): string[] {
  return readdirSync(path.join(root, relativePath))
    .sort()
    .flatMap((name) => {
      const relative = path.join(relativePath, name);
      const stat = lstatSync(path.join(root, relative));
      if (stat.isDirectory()) {
        return [`dir:${relative}`, ...snapshot(root, relative)];
      }
      return [
        `file:${relative}:${readFileSync(path.join(root, relative), "utf8")}`,
      ];
    });
}

function gitInit(root: string): void {
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["config", "user.name", "Setup Test"], { cwd: root });
  execFileSync("git", ["config", "user.email", "setup@example.com"], {
    cwd: root,
  });
  execFileSync("git", ["add", "-A"], { cwd: root });
  execFileSync("git", ["commit", "-qm", "initial"], { cwd: root });
}

afterEach(() => {
  cleanupFakeTemplates();
});

describe("setup run", () => {
  it("setup이 web만 선택했을 때 api를 지우고 web 환경 변수를 만든다", () => {
    const { root } = createFakeTemplate();

    const result = run(root, ["--name", "demo", "--apps", "web"]);

    expect(result.status, result.stderr).toBe(0);
    expect(existsSync(path.join(root, "apps/api"))).toBe(false);
    expect(readFileSync(path.join(root, ".env"), "utf8")).toContain(
      "VITE_API_BASE_URL=http://localhost:4000",
    );
  });

  it("setup이 api 없이 web을 선택했을 때 examples를 제거하고 결과를 출력한다", () => {
    const { root } = createFakeTemplate();

    const result = run(root, ["--name", "demo", "--apps", "web"]);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("examples 제거 결과");
    expect(existsSync(path.join(root, "example.txt"))).toBe(false);
    expect(existsSync(path.join(root, "scripts/remove-examples.mjs"))).toBe(
      false,
    );
  });

  it("setup이 이름 규칙을 만족하지 못할 때 파일을 바꾸지 않고 종료 코드 1로 끝난다", () => {
    const { root } = createFakeTemplate();
    const before = snapshot(root);

    const result = run(root, ["--name", "한글이름", "--apps", "web"]);

    expect(result.status).toBe(1);
    expect(snapshot(root)).toEqual(before);
  });

  it("setup이 알 수 없는 앱 id를 받을 때 파일을 바꾸지 않고 종료 코드 1로 끝난다", () => {
    const { root } = createFakeTemplate();
    const before = snapshot(root);

    const result = run(root, ["--name", "demo", "--apps", "unknown"]);

    expect(result.status).toBe(1);
    expect(snapshot(root)).toEqual(before);
  });

  it("setup이 dry-run일 때 두 목록만 출력하고 파일을 바꾸지 않는다", () => {
    const { root } = createFakeTemplate();
    const before = snapshot(root);

    const result = run(root, [
      "--name",
      "demo",
      "--apps",
      "web",
      "--dry-run",
    ]);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("[dry-run] 지울 경로:");
    expect(result.stdout).toContain("[dry-run] 고칠 파일:");
    expect(snapshot(root)).toEqual(before);
  });

  it("setup이 git 작업 트리의 커밋하지 않은 변경을 발견할 때 npm run setup을 거부한다", () => {
    const { root } = createFakeTemplate();
    gitInit(root);
    writeFileSync(path.join(root, "README.md"), "dirty\n");

    const result = run(root, ["--name", "demo", "--apps", "web"], {
      npm: true,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("커밋하지 않은 변경이 있습니다.");
    expect(readFileSync(path.join(root, "README.md"), "utf8")).toBe(
      "dirty\n",
    );
  });

  it("setup이 상위 git 저장소의 하위 폴더에서 실행될 때 변경 검사를 하지 않는다", () => {
    const { root, parent } = createFakeTemplate();
    gitInit(parent);

    const result = run(root, ["--name", "demo", "--apps", "web"]);

    expect(result.status, result.stderr).toBe(0);
  });

  it("setup이 기존 env 파일을 만날 때 내용을 유지하고 안내한다", () => {
    const { root } = createFakeTemplate();
    writeFileSync(path.join(root, ".env"), "SECRET=keep\n");

    const result = run(root, ["--name", "demo", "--apps", "web"]);

    expect(result.status, result.stderr).toBe(0);
    expect(readFileSync(path.join(root, ".env"), "utf8")).toBe(
      "SECRET=keep\n",
    );
    expect(result.stdout).toContain(".env 파일이 이미 있어 그대로 두었습니다.");
  });

  it("setup이 기존 env 파일로 dry-run할 때 건너뛸 사실을 안내한다", () => {
    const { root } = createFakeTemplate();
    writeFileSync(path.join(root, ".env"), "SECRET=keep\n");

    const result = run(root, [
      "--name",
      "demo",
      "--apps",
      "web",
      "--dry-run",
    ]);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain(".env 파일이 이미 있어 그대로 두었습니다.");
    expect(readFileSync(path.join(root, ".env"), "utf8")).toBe(
      "SECRET=keep\n",
    );
  });

  it("setup이 display-name을 생략했을 때 name 값을 표시 이름으로 쓴다", () => {
    const { root } = createFakeTemplate();

    const result = run(root, ["--name", "Demo App", "--apps", "api"]);

    expect(result.status, result.stderr).toBe(0);
    expect(readFileSync(path.join(root, "README.md"), "utf8")).toContain(
      "# Demo App",
    );
  });

  it("setup이 변환 전 이름을 받을 때 package 이름과 README 제목을 각각 반영한다", () => {
    const { root } = createFakeTemplate();

    const result = run(root, ["--name", "My Shop", "--apps", "api"]);

    expect(result.status, result.stderr).toBe(0);
    expect(
      JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")),
    ).toMatchObject({ name: "my-shop" });
    expect(readFileSync(path.join(root, "README.md"), "utf8")).toContain(
      "# My Shop",
    );
  });

  it("setup이 매니페스트에 mobile만 추가됐을 때 코드 변경 없이 선택하지 않은 mobile을 지운다", () => {
    const { root } = createFakeTemplate({ mobile: true });

    const result = run(root, ["--name", "demo", "--apps", "web"]);

    expect(result.status, result.stderr).toBe(0);
    expect(existsSync(path.join(root, "apps/mobile"))).toBe(false);
  });

  it("setup 모듈이 dry-run으로 직접 호출될 때 실제 파일을 바꾸지 않는다", () => {
    const { root } = createFakeTemplate();
    const before = snapshot(root);

    runSetup(root, ["--name", "demo", "--apps", "web", "--dry-run"]);

    expect(snapshot(root)).toEqual(before);
  });

  it("setup 모듈이 실제 적용으로 직접 호출될 때 선택 결과를 반영한다", () => {
    const { root } = createFakeTemplate();

    runSetup(root, ["--name", "demo", "--apps", "api"]);

    expect(existsSync(path.join(root, "apps/web"))).toBe(false);
    expect(existsSync(path.join(root, ".env"))).toBe(true);
  });

  it("setup 모듈이 name 없이 호출될 때 실행에 실패한다", () => {
    const { root } = createFakeTemplate();

    expect(() => runSetup(root, ["--apps", "web"])).toThrow(
      "--name 값이 필요합니다.",
    );
  });

  it("setup 모듈이 apps 없이 호출될 때 실행에 실패한다", () => {
    const { root } = createFakeTemplate();

    expect(() => runSetup(root, ["--name", "demo"])).toThrow(
      "--apps 값이 필요합니다.",
    );
  });

  it("setup 모듈이 잘못된 이름으로 호출될 때 실행에 실패한다", () => {
    const { root } = createFakeTemplate();

    expect(() =>
      runSetup(root, ["--name", "한글이름", "--apps", "web"]),
    ).toThrow("유효한 프로젝트 이름이 아닙니다.");
  });

  it("setup 모듈이 빈 표시 이름으로 호출될 때 실행에 실패한다", () => {
    const { root } = createFakeTemplate();

    expect(() =>
      runSetup(root, [
        "--name",
        "demo",
        "--display-name",
        " ",
        "--apps",
        "web",
      ]),
    ).toThrow("표시 이름은 비어 있을 수 없습니다.");
  });

  it("setup 모듈이 기존 env와 examples 제거 조건으로 호출될 때 env를 보존한다", () => {
    const { root } = createFakeTemplate();
    writeFileSync(path.join(root, ".env"), "SECRET=keep\n");

    runSetup(root, ["--name", "demo", "--apps", "web"]);

    expect(readFileSync(path.join(root, ".env"), "utf8")).toBe(
      "SECRET=keep\n",
    );
    expect(existsSync(path.join(root, "example.txt"))).toBe(false);
  });

  it("setup 모듈이 clean git 루트에서 dry-run할 때 실행을 허용한다", () => {
    const { root } = createFakeTemplate();
    gitInit(root);

    expect(() =>
      runSetup(root, ["--name", "demo", "--apps", "web", "--dry-run"]),
    ).not.toThrow();
  });

  it("setup 모듈이 dirty git 루트에서 호출될 때 실행에 실패한다", () => {
    const { root } = createFakeTemplate();
    gitInit(root);
    writeFileSync(path.join(root, "README.md"), "dirty\n");

    expect(() =>
      runSetup(root, ["--name", "demo", "--apps", "web"]),
    ).toThrow("커밋하지 않은 변경이 있습니다.");
  });
});
