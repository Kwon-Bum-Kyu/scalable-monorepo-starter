import { describe, expect, it } from "vitest";

import { readDesign } from "./designMdParser";

const frontmatter = (fields: string) => `---\n${fields}\n---\n`;
const completeMaps = `colors: {}\nrounded: {}\nspacing: {}\ntypography:\n  body:\n    fontFamily: Open Sans\n    fontSize: 16px\n    fontWeight: 999\n    lineHeight: 20px`;
const emptyMaps = `colors: {}\nrounded: {}\nspacing: {}\ntypography: {}`;

describe("DESIGN.md 파서", () => {
  it("굵기 값이 다른 타이포그래피 토큰 값과 같아도 해당 네임스페이스가 없으면 오류를 반환한다", () => {
    const result = readDesign(frontmatter(completeMaps), new Map([
      ["--font-family-sans", "Open Sans"],
      ["--font-size-base", "16px"],
      ["--font-weight-regular", "400"],
      ["--line-height-20", "20px"],
      ["--unrelated-token", "999"],
    ]));

    expect(result.typographyErrors).toEqual([
      'DESIGN.md typography.body.fontWeight 값 "999"에 대응하는 --font-weight-* 토큰이 @theme에 없다 — 토큰 표와 @theme에 먼저 추가하라',
    ]);
  });

  it.each(["colors", "rounded", "spacing", "typography"])(
    "frontmatter에 %s 맵이 없으면 C4-4 안내 메시지와 함께 실패한다",
    (key) => {
      const fields = emptyMaps.split("\n").filter((line) => !line.startsWith(`${key}:`)).join("\n");

      expect(() => readDesign(frontmatter(fields), new Map())).toThrow(`DESIGN.md frontmatter에 ${key} 맵이 없다`);
    },
  );
});
