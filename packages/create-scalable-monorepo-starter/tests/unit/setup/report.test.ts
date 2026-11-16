import { describe, expect, it } from "vitest";

import { formatReport } from "../../../src/setup/report.mjs";

describe("formatReport", () => {
  it("dry-run 계획에 지울 경로와 고칠 파일이 있을 때 두 목록을 출력한다", () => {
    const plan = {
      removals: ["apps/api"],
      edits: ["package.json"],
      notices: [],
    };

    expect(formatReport(plan, true)).toEqual([
      "[dry-run] 지울 경로: 1개",
      "  - apps/api",
      "[dry-run] 고칠 파일: 1개",
      "  - package.json",
    ]);
  });

  it("dry-run 계획의 지울 경로가 10개를 넘을 때 앞부분과 외 N개로 줄여 출력한다", () => {
    const plan = {
      removals: Array.from({ length: 12 }, (_, index) => `path-${index + 1}`),
      edits: [],
      notices: [],
    };

    expect(formatReport(plan, true)).toEqual([
      "[dry-run] 지울 경로: 12개",
      ...plan.removals.slice(0, 10).map((path) => `  - ${path}`),
      "  - 외 2개",
      "[dry-run] 고칠 파일: 0개",
    ]);
  });

  it("일반 실행 결과에 건수 요약 한 줄과 처리 목록 하나가 나온다", () => {
    const plan = {
      removals: ["apps/api", "apps/desktop"],
      edits: ["package.json"],
      notices: [],
    };

    expect(formatReport(plan, false)).toEqual([
      "처리 결과: 지운 경로 2개, 고친 파일 1개",
      "  - 삭제 apps/api",
      "  - 삭제 apps/desktop",
      "  - 수정 package.json",
    ]);
  });

  it("계획에 notices가 있을 때 목록 아래에 안내 줄을 붙인다", () => {
    const plan = {
      removals: [],
      edits: [],
      notices: [
        "symlink를 건너뛰었습니다: linked-file",
        ".env 파일을 그대로 둡니다.",
      ],
    };

    expect(formatReport(plan, false)).toEqual([
      "처리 결과: 지운 경로 0개, 고친 파일 0개",
      "안내: symlink를 건너뛰었습니다: linked-file",
      "안내: .env 파일을 그대로 둡니다.",
    ]);
  });

  it("계획의 notices가 비어 있을 때 안내 줄을 출력하지 않는다", () => {
    const lines = formatReport({ removals: [], edits: [], notices: [] }, false);

    expect(lines).toEqual(["처리 결과: 지운 경로 0개, 고친 파일 0개"]);
  });

  it("계획을 출력할 때 입력 객체를 바꾸지 않는다", () => {
    const plan = {
      removals: ["apps/api"],
      edits: ["package.json"],
      notices: ["안내"],
    };
    const before = structuredClone(plan);

    formatReport(plan, true);

    expect(plan).toEqual(before);
  });
});
