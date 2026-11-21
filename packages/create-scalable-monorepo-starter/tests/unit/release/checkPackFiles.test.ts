import { describe, expect, it } from "vitest";

import {
  checkPackFiles,
  parsePackFiles,
} from "../../../scripts/checkPackFiles.mjs";

const requiredFiles = [
  "package.json",
  "README.md",
  "LICENSE",
  "starter.manifest.json",
  "src/cli/index.mjs",
];

describe("checkPackFiles", () => {
  it("npm pack 파일 목록에 tests가 있을 때 검사에 실패한다", () => {
    expect(checkPackFiles([...requiredFiles, "tests/example.test.ts"])).toEqual([
      "허용되지 않은 파일: tests/example.test.ts",
    ]);
  });

  it("npm pack 파일 목록에 starter.manifest.json이 없을 때 검사에 실패한다", () => {
    expect(
      checkPackFiles(
        requiredFiles.filter((file) => file !== "starter.manifest.json"),
      ),
    ).toContain("필수 파일 누락: starter.manifest.json");
  });

  it("npm pack 파일 목록에 LICENSE가 없을 때 검사에 실패한다", () => {
    expect(
      checkPackFiles(requiredFiles.filter((file) => file !== "LICENSE")),
    ).toContain("필수 파일 누락: LICENSE");
  });

  it("npm pack 파일 목록이 허용 목록과 맞을 때 검사에 성공한다", () => {
    expect(checkPackFiles(requiredFiles)).toEqual([]);
  });

  it("npm pack JSON을 파일 경로 목록으로 해석한다", () => {
    const input = JSON.stringify([
      { files: requiredFiles.map((path) => ({ path, size: 1, mode: 420 })) },
    ]);

    expect(parsePackFiles(input)).toEqual(requiredFiles);
  });
});
