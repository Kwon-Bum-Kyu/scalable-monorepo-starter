import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const sourceScript = path.resolve(
  import.meta.dirname,
  "../../../../scripts/remove-examples.mjs",
);
const tempDirectories: string[] = [];

function makeTemplate(withParity: boolean): string {
  const root = mkdtempSync(path.join(tmpdir(), "remove-examples-message-"));
  tempDirectories.push(root);
  mkdirSync(path.join(root, "scripts"), { recursive: true });
  mkdirSync(path.join(root, "apps/api"), { recursive: true });
  copyFileSync(sourceScript, path.join(root, "scripts/remove-examples.mjs"));
  if (withParity) {
    writeFileSync(path.join(root, "scripts/check-renderer-parity.mjs"), "");
  }
  return root;
}

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("remove-examples 마지막 안내", () => {
  it("스크립트가 api가 있는 템플릿에서 끝날 때 마이그레이션 안내를 두 줄로 출력한다", () => {
    const root = makeTemplate(false);

    const output = execFileSync(
      process.execPath,
      ["scripts/remove-examples.mjs"],
      { cwd: root, encoding: "utf8" },
    );

    expect(output).toContain(
      "예제 테이블을 지우는 마이그레이션이 필요합니다. 다음 명령을 실행해 주세요.\n" +
        "  cd apps/api && npm run migrate -- --name drop_examples_table\n",
    );
  });

  it("스크립트가 parity 검사 파일이 없는 템플릿에서 끝날 때 check:parity를 권하지 않는다", () => {
    const root = makeTemplate(false);

    const output = execFileSync(
      process.execPath,
      ["scripts/remove-examples.mjs"],
      { cwd: root, encoding: "utf8" },
    );

    expect(output).not.toContain("check:parity");
  });

  it("스크립트가 parity 검사 파일이 있는 템플릿에서 끝날 때 check:parity를 권한다", () => {
    const root = makeTemplate(true);

    const output = execFileSync(
      process.execPath,
      ["scripts/remove-examples.mjs"],
      { cwd: root, encoding: "utf8" },
    );

    expect(output).toContain("npm run check:parity");
  });
});
