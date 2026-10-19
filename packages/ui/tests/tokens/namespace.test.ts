// @vitest-environment node

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

import { compile } from "tailwindcss";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  assertNoPrefix,
  clearGlobalsCache,
  getThemeBlockSource,
} from "./helpers";

const RULES_PATH = resolve(
  __dirname,
  "../../../../.claude/rules/tailwind-v4.md",
);
const requireFromTest = createRequire(__filename);

/** tailwind-v4.md "네임스페이스 → utility 매핑" 표의 네임스페이스 열과 1:1로 유지한다. */
const STANDARD_PREFIXES: ReadonlyArray<string> = [
  "--color-",
  "--spacing-",
  "--container-",
  "--font-",
  "--text-",
  "--leading-",
  "--font-weight-",
  "--tracking-",
  "--breakpoint-",
  "--radius-",
  "--shadow-",
];

/** Tailwind v4가 읽지 않는 v3식 이름. 허용 목록의 "--font-"가 이 이름들을 통과시키므로 따로 금지한다(F3). */
const LEGACY_V3_PREFIXES: ReadonlyArray<string> = [
  "--font-family-",
  "--font-size-",
  "--line-height-",
];

const COMPILE_CASES: Readonly<
  Record<string, { candidate: string; selector: string }>
> = {
  "--color-": {
    candidate: "bg-namespace-check",
    selector: ".bg-namespace-check",
  },
  "--spacing-": {
    candidate: "p-namespace-check",
    selector: ".p-namespace-check",
  },
  "--container-": {
    candidate: "max-w-namespace-check",
    selector: ".max-w-namespace-check",
  },
  "--font-": {
    candidate: "font-namespace-family",
    selector: ".font-namespace-family",
  },
  "--text-": {
    candidate: "text-namespace-check",
    selector: ".text-namespace-check",
  },
  "--leading-": {
    candidate: "leading-namespace-check",
    selector: ".leading-namespace-check",
  },
  "--font-weight-": {
    candidate: "font-namespace-weight",
    selector: ".font-namespace-weight",
  },
  "--tracking-": {
    candidate: "tracking-namespace-check",
    selector: ".tracking-namespace-check",
  },
  "--breakpoint-": {
    candidate: "namespace-check:block",
    selector: ".namespace-check\\:block",
  },
  "--radius-": {
    candidate: "rounded-namespace-check",
    selector: ".rounded-namespace-check",
  },
  "--shadow-": {
    candidate: "shadow-namespace-check",
    selector: ".shadow-namespace-check",
  },
};

/** @theme 본문에서 선언된 토큰 이름 목록 */
function themeTokenNames(themeBody: string): string[] {
  return [...themeBody.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map(
    (match) => match[1],
  );
}

/** v3식 이름 토큰만 골라 반환 */
function legacyTokens(tokens: ReadonlyArray<string>): string[] {
  return tokens.filter((token) =>
    LEGACY_V3_PREFIXES.some((prefix) => token.startsWith(prefix)),
  );
}

/** 매핑 표 네임스페이스 열의 `--xxx-*`를 `--xxx-` 접두어 목록으로 읽는다. */
function readMappingTablePrefixes(markdown: string): string[] {
  const section = markdown
    .split(/^## /m)
    .find((part) => part.startsWith("네임스페이스 → utility 매핑"));
  if (section === undefined) {
    throw new Error(
      "tailwind-v4.md에서 '## 네임스페이스 → utility 매핑' 절을 찾을 수 없다",
    );
  }
  return [...section.matchAll(/^\|\s*`(--[a-z-]+-)\*`\s*\|/gm)].map(
    (match) => match[1],
  );
}

async function compileNamespaceFixtures(): Promise<string> {
  const css = `@import "tailwindcss";
@theme {
  --color-namespace-check: #000;
  --spacing-namespace-check: 1rem;
  --container-namespace-check: 40rem;
  --font-namespace-family: "Open Sans", sans-serif;
  --text-namespace-check: 1rem;
  --text-namespace-check--line-height: 1.5rem;
  --leading-namespace-check: 1.5;
  --font-weight-namespace-weight: 700;
  --tracking-namespace-check: 0.01em;
  --breakpoint-namespace-check: 40rem;
  --radius-namespace-check: 0.5rem;
  --shadow-namespace-check: 0 1px 2px #000;
}`;
  const compiler = await compile(css, {
    base: process.cwd(),
    async loadStylesheet(id, base) {
      const path =
        id === "tailwindcss"
          ? requireFromTest.resolve("tailwindcss/index.css")
          : resolve(base, id);
      return {
        path,
        base: dirname(path),
        content: readFileSync(path, "utf-8"),
      };
    },
  });
  return compiler.build(
    STANDARD_PREFIXES.map((prefix) => COMPILE_CASES[prefix].candidate),
  );
}

const LEGACY_FIXTURE = [
  "  --font-family-x: a;",
  "  --font-size-x: 1px;",
  "  --line-height-x: 1px;",
  "  --font-weight-bold: 700;",
  "  --font-body-alt: b;",
  "  --text-xs--line-height: 16px;",
].join("\n");

describe("namespace 정합 (FR-11)", () => {
  const rules = readFileSync(RULES_PATH, "utf-8");
  let compiledCss = "";

  beforeAll(async () => {
    compiledCss = await compileNamespaceFixtures();
  });

  afterAll(() => {
    clearGlobalsCache();
  });

  describe("비표준 namespace 토큰 0건 단언", () => {
    it("@theme 블록에 --size-* prefix 토큰이 잔존하지 않는다", () => {
      assertNoPrefix("--size-");
    });

    it("@theme 블록에 --token-* / --design-* 같은 임의 prefix 가 잔존하지 않는다", () => {
      assertNoPrefix("--token-");
      assertNoPrefix("--design-");
    });

    it.each(LEGACY_V3_PREFIXES)(
      "@theme 블록에 Tailwind v3식 %s prefix 토큰이 잔존하지 않는다",
      (prefix) => {
        assertNoPrefix(prefix);
      },
    );

    it("v3식 이름 3종이 섞인 @theme 픽스처에서 3종 모두 위반으로 검출된다", () => {
      expect(legacyTokens(themeTokenNames(LEGACY_FIXTURE))).toEqual([
        "--font-family-x",
        "--font-size-x",
        "--line-height-x",
      ]);
    });
  });

  describe("Tailwind v4 표준 namespace 만 사용", () => {
    it("@theme 블록의 모든 토큰이 표준 namespace 중 하나로 시작한다", () => {
      const tokens = themeTokenNames(getThemeBlockSource());

      for (const token of tokens) {
        const hasStandardPrefix = STANDARD_PREFIXES.some((prefix) =>
          token.startsWith(prefix),
        );
        expect(
          hasStandardPrefix,
          `비표준 namespace 토큰 발견: ${token}. 허용 prefix: ${STANDARD_PREFIXES.join(", ")}`,
        ).toBe(true);
      }
      expect(tokens.length).toBeGreaterThan(0);
    });
  });

  describe("tailwind-v4.md 매핑 표 정합", () => {
    it.each(STANDARD_PREFIXES)(
      "%s 허용 prefix가 규칙 표에 등재되고 실제 utility를 생성한다",
      (prefix) => {
        expect(readMappingTablePrefixes(rules)).toContain(prefix);
        expect(compiledCss).toContain(COMPILE_CASES[prefix].selector);
      },
    );

    it("tailwind-v4.md 매핑 표에 허용 prefix 목록 밖의 네임스페이스가 없다", () => {
      expect(
        readMappingTablePrefixes(rules).filter(
          (prefix) => !STANDARD_PREFIXES.includes(prefix),
        ),
      ).toEqual([]);
    });

    it("매핑 표의 --text-* 행 이름이 바뀌면 허용 prefix 대조에 실패한다", () => {
      const tampered = rules.replace("| `--text-*`", "| `--typo-*`");
      expect(tampered).not.toBe(rules);
      expect(readMappingTablePrefixes(tampered)).not.toContain("--text-");
      expect(
        readMappingTablePrefixes(tampered).filter(
          (prefix) => !STANDARD_PREFIXES.includes(prefix),
        ),
      ).toEqual(["--typo-"]);
    });
  });
});
