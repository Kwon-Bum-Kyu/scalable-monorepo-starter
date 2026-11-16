import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  checkTargetDir,
  createWorkDir,
  removeWorkDir,
} from "../../../src/cli/workDir.mjs";

let base: string;

beforeEach(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), "workdir-test-"));
});

afterEach(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

describe("checkTargetDir", () => {
  it("대상 폴더가 없을 때 쓸 수 있다고 판정한다", () => {
    expect(checkTargetDir(path.join(base, "my-app"))).toEqual({ usable: true });
  });

  it("대상 폴더가 비어 있을 때 쓸 수 있다고 판정한다", () => {
    const dir = path.join(base, "my-app");
    fs.mkdirSync(dir);
    expect(checkTargetDir(dir)).toEqual({ usable: true });
  });

  it("대상 폴더에 파일이 있을 때 쓸 수 없다고 판정한다", () => {
    const dir = path.join(base, "my-app");
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, "a.txt"), "x");
    expect(checkTargetDir(dir)).toEqual({ usable: false, reason: "not-empty" });
  });

  it("대상 경로가 파일일 때 쓸 수 없다고 판정한다", () => {
    const file = path.join(base, "my-app");
    fs.writeFileSync(file, "x");
    expect(checkTargetDir(file)).toEqual({
      usable: false,
      reason: "not-empty",
    });
  });
});

describe("createWorkDir", () => {
  it("임시 폴더가 대상 폴더와 같은 부모에 점으로 시작하는 이름으로 만들어진다", () => {
    const work = createWorkDir(path.join(base, "my-app"), "my-app");
    expect(path.dirname(work.path)).toBe(base);
    expect(path.basename(work.path)).toMatch(/^\.my-app\.tmp-.+/);
    expect(fs.existsSync(work.path)).toBe(true);
    work.cleanup();
  });

  it("정리 함수가 등록된 임시 폴더 하나만 지운다", () => {
    const target = path.join(base, "my-app");
    fs.mkdirSync(target);
    fs.writeFileSync(path.join(target, "keep.txt"), "x");
    const other = createWorkDir(target, "other");
    const work = createWorkDir(target, "my-app");

    work.cleanup();

    expect(fs.existsSync(work.path)).toBe(false);
    expect(fs.existsSync(other.path)).toBe(true);
    expect(fs.existsSync(path.join(target, "keep.txt"))).toBe(true);
    other.cleanup();
  });

  it("대상 이름의 폴더가 비어 있을 때 이름을 바꾸기 전에 지우고 바꾼다", () => {
    const target = path.join(base, "my-app");
    fs.mkdirSync(target);
    const work = createWorkDir(target, "my-app");
    fs.writeFileSync(path.join(work.path, "a.txt"), "x");

    work.promote();

    expect(fs.readFileSync(path.join(target, "a.txt"), "utf8")).toBe("x");
    expect(fs.existsSync(work.path)).toBe(false);
  });

  it("대상 이름의 폴더가 없을 때 이름을 바꿔 대상 폴더가 된다", () => {
    const target = path.join(base, "my-app");
    const work = createWorkDir(target, "my-app");
    work.promote();
    expect(fs.statSync(target).isDirectory()).toBe(true);
  });

  it("대상 이름의 폴더가 비어 있지 않을 때 이름 바꾸기에 실패하고 임시 폴더를 지운다", () => {
    const target = path.join(base, "my-app");
    fs.mkdirSync(target);
    fs.writeFileSync(path.join(target, "mine.txt"), "x");
    const work = createWorkDir(target, "my-app");

    expect(() => work.promote()).toThrow();

    expect(fs.existsSync(work.path)).toBe(false);
    expect(fs.readFileSync(path.join(target, "mine.txt"), "utf8")).toBe("x");
  });

  it("이름을 바꾼 뒤에는 등록이 해제되어 정리 함수가 아무것도 지우지 않는다", () => {
    const target = path.join(base, "my-app");
    const work = createWorkDir(target, "my-app");
    work.promote();

    work.cleanup();

    expect(fs.statSync(target).isDirectory()).toBe(true);
  });
});

describe("removeWorkDir", () => {
  it("등록되지 않은 경로는 삭제 대상이 될 수 없다", () => {
    const target = path.join(base, "my-app");
    fs.mkdirSync(target);
    for (const p of [target, base, os.homedir()]) {
      expect(() => removeWorkDir(p)).toThrow();
    }
    expect(fs.existsSync(target)).toBe(true);
    expect(fs.existsSync(base)).toBe(true);
  });
});
