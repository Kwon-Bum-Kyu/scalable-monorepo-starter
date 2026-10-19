// @vitest-environment node

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { assertHexColor, getCssVar } from "./helpers";

const CONTRACT_CSS_PATH = resolve(
  __dirname,
  "../../src/styles/open-design-contract.css",
);
const REPO_ROOT = resolve(__dirname, "../../../..");
const BRIDGE_FILE = "open-design-contract.css";
/** CSS @import, ESM import·from, 동적 import, require로 브리지를 참조하는 구문 */
const BRIDGE_IMPORT =
  /(?:@import\s+(?:url\(\s*)?|\bfrom\s+|\bimport\s*\(?\s*|\brequire\(\s*)["'][^"'\n]*open-design-contract/;
/** 탐색 중 가지치기하는 빌드 산출·캐시 디렉터리 이름 */
const PRUNED_DIRS: ReadonlySet<string> = new Set([
  "node_modules",
  "dist",
  "out",
  ".vite",
  ".turbo",
  "coverage",
  "generated",
  "storybook-static",
  "playwright-report",
  "test-results",
]);
const SCANNED_FILE = /\.(?:css|tsx?)$/;

/** D-OD-4 (G1.5 확정값). 선택지 (A) 브랜드 = --color-blue-500 */
const ACCENT_THEME_TOKEN = "--color-blue-500";

const A1_IDENTITY_MAP: ReadonlyArray<{ slot: string; themeToken: string }> = [
  { slot: "--bg", themeToken: "--color-system-white" },
  { slot: "--surface", themeToken: "--color-system-white" },
  { slot: "--fg", themeToken: "--color-gray-900" },
  { slot: "--muted", themeToken: "--color-gray-400" },
  { slot: "--border", themeToken: "--color-gray-100" },
  { slot: "--accent", themeToken: ACCENT_THEME_TOKEN },
];

const STATUS_SLOT_MAP: ReadonlyArray<{ slot: string; themeToken: string }> = [
  { slot: "--success", themeToken: "--color-system-green" },
  { slot: "--warn", themeToken: "--color-system-warning" },
  { slot: "--danger", themeToken: "--color-system-red" },
];

const MAPPED_SLOTS: ReadonlySet<string> = new Set(
  [...A1_IDENTITY_MAP, ...STATUS_SLOT_MAP].map(({ slot }) => slot),
);

function declaredSlots(source: string): string[] {
  const block = /\[data-open-design-contract\]\s*\{([^}]*)\}/.exec(source);
  if (!block) {
    throw new Error(
      "open-design-contract.css에 [data-open-design-contract] 블록이 없다",
    );
  }

  const declarations = block[1].replace(/\/\*[\s\S]*?\*\//g, "");
  return [...declarations.matchAll(/(?:^|;)\s*(--[\w-]+)\s*:/g)].map(
    (match) => match[1],
  );
}

function findBridgeImporters(root: string): string[] {
  const importers: string[] = [];

  function scan(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!PRUNED_DIRS.has(entry.name)) {
          scan(resolve(directory, entry.name));
        }
        continue;
      }
      if (!entry.isFile() || !SCANNED_FILE.test(entry.name)) continue;

      const path = resolve(directory, entry.name);
      if (BRIDGE_IMPORT.test(readFileSync(path, "utf-8"))) {
        importers.push(relative(root, path));
      }
    }
  }

  scan(root);
  return importers.sort();
}

let tmpRoot: string | undefined;

afterEach(() => {
  if (tmpRoot) {
    rmSync(tmpRoot, { recursive: true, force: true });
    tmpRoot = undefined;
  }
});

function readContractSource(): string {
  return readFileSync(CONTRACT_CSS_PATH, "utf-8");
}

function getContractVar(name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`${escaped}\\s*:\\s*([^;]+);`).exec(
    readContractSource(),
  );
  if (!match) {
    throw new Error(`Token ${name} not found in open-design-contract.css`);
  }
  return match[1].trim();
}

describe("open-design-contract 브리지 CSS", () => {
  it("브리지 CSS에 선언된 슬롯이 모두 A1-identity·상태색 매핑에 등록되어 있다", () => {
    const slots = declaredSlots(readContractSource());

    expect(slots.filter((slot) => !MAPPED_SLOTS.has(slot))).toEqual([]);
    expect(slots).toHaveLength(MAPPED_SLOTS.size);
  });

  it("매핑에 없는 슬롯을 선언한 브리지 CSS는 역방향 대조에 실패한다", () => {
    const tamperedContract = readContractSource().replace(
      "--danger:",
      "--new-slot: #000000;\n  --danger:",
    );

    expect(
      declaredSlots(tamperedContract).filter((slot) => !MAPPED_SLOTS.has(slot)),
    ).toEqual(["--new-slot"]);
  });

  it("apps·packages 소스 어디에서도 브리지 CSS를 import하지 않는다", () => {
    const sourceRoots = ["apps", "packages"].flatMap((scope) =>
      readdirSync(resolve(REPO_ROOT, scope), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => resolve(REPO_ROOT, scope, entry.name, "src"))
        .filter(existsSync),
    );
    const importers = sourceRoots.flatMap((root) =>
      findBridgeImporters(root).map((file) =>
        relative(REPO_ROOT, resolve(root, file)),
      ),
    );

    expect(importers).toEqual([]);
  });

  it("A1-identity 6슬롯이 모두 선언된다", () => {
    for (const { slot } of A1_IDENTITY_MAP) {
      expect(() => getContractVar(slot)).not.toThrow();
    }
  });

  it.each(A1_IDENTITY_MAP)(
    "$slot 슬롯 값이 대응 @theme 토큰 리터럴과 일치한다",
    ({ slot, themeToken }) => {
      assertHexColor(getContractVar(slot), getCssVar(themeToken));
    },
  );

  it("상태색 3슬롯이 모두 선언된다", () => {
    for (const { slot } of STATUS_SLOT_MAP) {
      expect(() => getContractVar(slot)).not.toThrow();
    }
  });

  it.each(STATUS_SLOT_MAP)(
    "$slot 슬롯 값이 대응 @theme 토큰 리터럴과 일치한다",
    ({ slot, themeToken }) => {
      assertHexColor(getContractVar(slot), getCssVar(themeToken));
    },
  );

  it("브리지 선언에 var() 참조가 없다", () => {
    const match = /\[data-open-design-contract\]\s*\{([^}]*)\}/.exec(
      readContractSource(),
    );
    expect(match).not.toBeNull();
    expect(match![1]).not.toMatch(/var\(/);
  });

  it("헤더 주석에 SSOT 선언과 값 수정 금지 규칙이 포함된다", () => {
    const source = readContractSource();
    expect(source).toContain("단일 출처");
    expect(source).toContain("@theme");
    expect(source).toContain("값 수정 금지");
    expect(source).toContain("DESIGN.md");
  });

  it("globals.css가 브리지 파일을 @import하지 않는다", () => {
    const source = readFileSync(
      resolve(__dirname, "../../src/styles/globals.css"),
      "utf-8",
    );
    expect(source).not.toContain("open-design-contract");
  });

  it("packages/ui 공개 exports에 브리지 파일이 없다", () => {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, "../../package.json"), "utf-8"),
    );
    expect(JSON.stringify(pkg.exports)).not.toContain("open-design-contract");
  });
});

describe("브리지 역-import 검사기", () => {
  it("빌드 캐시 디렉터리 안의 import는 무시하고 소스 디렉터리의 import만 검출한다", () => {
    tmpRoot = mkdtempSync(join(tmpdir(), "odc-scan-"));
    mkdirSync(join(tmpRoot, "node_modules/.vite/deps"), { recursive: true });
    mkdirSync(join(tmpRoot, "dist/assets"), { recursive: true });
    mkdirSync(join(tmpRoot, "src"), { recursive: true });
    writeFileSync(
      join(tmpRoot, "node_modules/.vite/deps/chunk.js"),
      `import "../../src/styles/${BRIDGE_FILE}";`,
    );
    writeFileSync(
      join(tmpRoot, "dist/assets/app.css"),
      `@import "./${BRIDGE_FILE}";`,
    );
    writeFileSync(
      join(tmpRoot, "src/app.css"),
      `@import "./styles/${BRIDGE_FILE}";`,
    );
    writeFileSync(join(tmpRoot, "src/clean.ts"), "export const x = 1;");

    expect(findBridgeImporters(tmpRoot)).toEqual([join("src", "app.css")]);
  });
});
