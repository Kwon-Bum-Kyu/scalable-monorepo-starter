import { describe, expect, it, vi } from "vitest";

import {
  checkReleaseVersions,
  isTagInMain,
} from "../../../scripts/checkReleaseVersions.mjs";

const matchingRelease = {
  tag: "v1.3.0",
  rootVersion: "1.3.0",
  cliVersion: "1.3.0",
  repository: "Kwon-Bum-Kyu/scalable-monorepo-starter",
  repositoryUrl:
    "git+https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter.git",
  tagInMain: true,
};

describe("checkReleaseVersions", () => {
  it("태그의 버전과 루트 버전이 다를 때 검사에 실패한다", () => {
    const result = checkReleaseVersions({
      ...matchingRelease,
      rootVersion: "1.3.1",
    });

    expect(result.errors).toContain(
      "루트 package.json version 불일치: 기대값 1.3.0, 실제값 1.3.1",
    );
  });

  it("루트 버전과 CLI 패키지 버전이 다를 때 검사에 실패한다", () => {
    const result = checkReleaseVersions({
      ...matchingRelease,
      cliVersion: "1.3.1",
    });

    expect(result.errors).toContain(
      "CLI package.json version 불일치: 기대값 1.3.0, 실제값 1.3.1",
    );
  });

  it("태그와 두 package.json 버전이 같을 때 검사에 성공한다", () => {
    expect(checkReleaseVersions(matchingRelease)).toEqual({
      errors: [],
      prerelease: false,
    });
  });

  it("태그가 프리릴리스 버전일 때 프리릴리스로 판정한다", () => {
    const result = checkReleaseVersions({
      ...matchingRelease,
      tag: "v1.3.0-rc.2",
      rootVersion: "1.3.0-rc.2",
      cliVersion: "1.3.0-rc.2",
    });

    expect(result).toEqual({ errors: [], prerelease: true });
  });

  it("CLI repository.url이 저장소와 다를 때 검사에 실패한다", () => {
    const result = checkReleaseVersions({
      ...matchingRelease,
      repositoryUrl: "git+https://github.com/example/other.git",
    });

    expect(result.errors).toContain(
      "CLI package.json repository.url 불일치: 기대값 git+https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter.git, 실제값 git+https://github.com/example/other.git",
    );
  });

  it("태그 커밋이 origin/main 이력에 없을 때 검사에 실패한다", () => {
    const runGit = vi.fn(() => ({ status: 1, stderr: "" }));
    const tagInMain = isTagInMain("v1.3.0", runGit);

    expect(
      checkReleaseVersions({ ...matchingRelease, tagInMain }).errors,
    ).toContain(
      "태그 커밋 불일치: 기대값 origin/main 이력에 포함, 실제값 포함되지 않음",
    );
  });

  it("태그가 vX.Y.Z 형식이 아닐 때 검사에 실패한다", () => {
    const result = checkReleaseVersions({
      ...matchingRelease,
      tag: "release-1.3.0",
    });

    expect(result.errors).toEqual([
      "태그 형식 불일치: 기대값 vX.Y.Z 또는 프리릴리스, 실제값 release-1.3.0",
    ]);
  });

  it("git이 태그를 찾지 못할 때 main 포함 판정에 실패한다", () => {
    const runGit = vi.fn(() => ({
      status: 128,
      stderr: "fatal: Not a valid object name v9.9.9\n",
    }));

    expect(() => isTagInMain("v9.9.9", runGit)).toThrow(
      "fatal: Not a valid object name v9.9.9",
    );
  });
});
