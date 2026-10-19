import { describe, expect, it } from "vitest";

import { readDesign } from "./designMdParser";

const frontmatter = (fields: string) => `---\n${fields}\n---\n`;
const completeMaps = `colors: {}\nrounded: {}\nspacing: {}\ntypography:\n  body:\n    fontFamily: Open Sans\n    fontSize: 16px\n    fontWeight: 999\n    lineHeight: 20px`;
const emptyMaps = `colors: {}\nrounded: {}\nspacing: {}\ntypography: {}`;

describe("DESIGN.md 파서", () => {
  it("굵기 값이 다른 타이포그래피 토큰 값과 같아도 해당 네임스페이스가 없으면 오류를 반환한다", () => {
    const result = readDesign(
      frontmatter(completeMaps),
      new Map([
        ["--font-sans", "Open Sans"],
        ["--text-base", "16px"],
        ["--font-weight-regular", "400"],
        ["--text-sm--line-height", "20px"],
        ["--unrelated-token", "999"],
      ]),
    );

    expect(result.typographyErrors).toEqual([
      'DESIGN.md typography.body.fontWeight 값 "999"에 대응하는 --font-weight-* 토큰이 @theme에 없다 — 토큰 표와 @theme에 먼저 추가하라',
    ]);
  });

  it.each(["colors", "rounded", "spacing", "typography"])(
    "frontmatter에 %s 맵이 없으면 C4-4 안내 메시지와 함께 실패한다",
    (key) => {
      const fields = emptyMaps
        .split("\n")
        .filter((line) => !line.startsWith(`${key}:`))
        .join("\n");

      expect(() => readDesign(frontmatter(fields), new Map())).toThrow(
        `DESIGN.md frontmatter에 ${key} 맵이 없다`,
      );
    },
  );

  it("fontSize 값이 --text-<k>--line-height 값과만 같으면 크기 토큰 누락 오류를 반환한다", () => {
    const fields = `colors: {}
rounded: {}
spacing: {}
typography:
  body:
    fontFamily: Open Sans
    fontSize: 20px
    fontWeight: 400
    lineHeight: 20px`;
    const result = readDesign(
      frontmatter(fields),
      new Map([
        ["--font-sans", "Open Sans"],
        ["--font-weight-regular", "400"],
        ["--text-sm", "14px"],
        ["--text-sm--line-height", "20px"],
      ]),
    );

    expect(result.typographyErrors).toEqual([
      'DESIGN.md typography.body.fontSize 값 "20px"에 대응하는 --text-<k> 토큰이 @theme에 없다 — 토큰 표와 @theme에 먼저 추가하라',
    ]);
  });

  it("fontFamily 값이 --font-weight-* 토큰 값과만 같으면 글꼴 토큰 누락 오류를 반환한다", () => {
    const fields = `colors: {}
rounded: {}
spacing: {}
typography:
  body:
    fontFamily: "700"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24px`;
    const result = readDesign(
      frontmatter(fields),
      new Map([
        ["--font-weight-bold", "700"],
        ["--text-base", "16px"],
        ["--text-base--line-height", "24px"],
      ]),
    );

    expect(result.typographyErrors).toEqual([
      'DESIGN.md typography.body.fontFamily 값 "700"에 대응하는 --font-<name> 토큰이 @theme에 없다 — 토큰 표와 @theme에 먼저 추가하라',
    ]);
  });

  it("Tailwind v3식 크기·행간 이름만 있으면 크기·행간 대응 오류를 반환한다", () => {
    const fields = `colors: {}
rounded: {}
spacing: {}
typography:
  body:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 20px`;
    const result = readDesign(
      frontmatter(fields),
      new Map([
        ["--font-sans", "Open Sans"],
        ["--font-size-base", "16px"],
        ["--line-height-20", "20px"],
        ["--font-weight-regular", "400"],
      ]),
    );

    expect(result.typographyErrors).toEqual([
      'DESIGN.md typography.body.fontSize 값 "16px"에 대응하는 --text-<k> 토큰이 @theme에 없다 — 토큰 표와 @theme에 먼저 추가하라',
      'DESIGN.md typography.body.lineHeight 값 "20px"에 대응하는 --text-<k>--line-height 토큰이 @theme에 없다 — 토큰 표와 @theme에 먼저 추가하라',
    ]);
  });
});
