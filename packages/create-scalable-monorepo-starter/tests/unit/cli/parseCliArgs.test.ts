import { describe, expect, it } from "vitest";

import { FLAG_TABLE, parseCliArgs } from "../../../src/cli/parseCliArgs.mjs";

function values(argv: string[]) {
  const result = parseCliArgs(argv);
  if (!result.ok) {
    throw new Error(`해석 실패: ${result.reason}`);
  }
  return result.values;
}

describe("parseCliArgs", () => {
  it("인자가 없을 때 이름과 앱 없이 기본값으로 해석된다", () => {
    expect(values([])).toEqual({
      name: undefined,
      apps: undefined,
      examples: undefined,
      yes: false,
      install: true,
      git: true,
      dryRun: false,
      help: false,
      version: false,
    });
  });

  it("--apps api,web을 줄 때 앱 id 배열로 해석된다", () => {
    expect(values(["--apps", "api,web"]).apps).toEqual(["api", "web"]);
  });

  it("--apps=desktop 형태로 줄 때도 앱 id 배열로 해석된다", () => {
    expect(values(["--apps=desktop"]).apps).toEqual(["desktop"]);
  });

  it("--apps 값에 공백과 빈 항목이 섞여 있을 때 걸러서 해석된다", () => {
    expect(values(["--apps", " api, ,web,"]).apps).toEqual(["api", "web"]);
  });

  it("위치 인자가 하나일 때 프로젝트 이름으로 해석된다", () => {
    expect(values(["my-app", "--yes"])).toMatchObject({ name: "my-app", yes: true });
  });

  it("--yes만 주고 이름이 없을 때 이름은 비어 있는 채로 해석된다", () => {
    expect(values(["--yes"])).toMatchObject({ name: undefined, yes: true });
  });

  it("위치 인자가 둘 이상일 때 실패한다", () => {
    expect(parseCliArgs(["a", "b"])).toEqual({ ok: false, reason: "too-many-positionals" });
  });

  it("--remove-examples를 줄 때 examples가 remove로 해석된다", () => {
    expect(values(["--remove-examples"]).examples).toBe("remove");
  });

  it("--keep-examples를 줄 때 examples가 keep으로 해석된다", () => {
    expect(values(["--keep-examples"]).examples).toBe("keep");
  });

  it("--remove-examples와 --keep-examples를 함께 줄 때 실패한다", () => {
    expect(parseCliArgs(["--remove-examples", "--keep-examples"])).toEqual({
      ok: false,
      reason: "conflicting-examples",
    });
  });

  it("--no-install과 --no-git이 각각 설치와 git 생략으로 해석된다", () => {
    expect(values(["--no-install"])).toMatchObject({ install: false, git: true });
    expect(values(["--no-git"])).toMatchObject({ install: true, git: false });
  });

  it("--dry-run, --help, --version이 각각 켜진 것으로 해석된다", () => {
    expect(values(["--dry-run"]).dryRun).toBe(true);
    expect(values(["--help"]).help).toBe(true);
    expect(values(["--version"]).version).toBe(true);
  });

  it("알 수 없는 플래그를 줄 때 그 플래그를 담아 실패한다", () => {
    const result = parseCliArgs(["--template-ref", "v1.0.0"]);
    expect(result).toMatchObject({ ok: false, reason: "invalid-option" });
  });

  it("--apps에 값이 없을 때 실패한다", () => {
    expect(parseCliArgs(["--apps"])).toMatchObject({ ok: false, reason: "invalid-option" });
  });

  it("플래그 표가 PRD의 플래그를 모두 담고 --template-ref와 --template-dir는 담지 않는다", () => {
    const names = FLAG_TABLE.flatMap((row) => row.flags);
    expect(names).toEqual(
      expect.arrayContaining([
        "--apps",
        "--remove-examples",
        "--keep-examples",
        "--yes",
        "--no-install",
        "--no-git",
        "--dry-run",
        "--help",
        "--version",
      ]),
    );
    expect(names).not.toContain("--template-ref");
    expect(names).not.toContain("--template-dir");
  });
});
