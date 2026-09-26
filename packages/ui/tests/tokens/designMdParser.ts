import { load } from "js-yaml";

export type TokenMap = ReadonlyMap<string, string>;
export interface ValueMismatch { token: string; design: string; theme: string }
export interface TokenDiff {
  missingInTheme: ReadonlyArray<string>;
  missingInDesign: ReadonlyArray<string>;
  valueMismatches: ReadonlyArray<ValueMismatch>;
}

interface TypographyRole {
  fontFamily: string;
  fontSize: string;
  fontWeight: number | string;
  lineHeight: string;
  letterSpacing?: string;
}
interface DesignFrontmatter {
  colors: Record<string, string>;
  rounded: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, TypographyRole>;
}
export interface ParsedDesign {
  tokens: Map<string, string>;
  typographyErrors: string[];
  tableErrors: string[];
}

const TOKEN_TABLE_HEADER = /^\|\s*토큰\s*\|\s*값\s*\|\s*용도\s*\|\s*$/;
const TOKEN_TABLE_SEPARATOR = /^\|(\s*:?-+:?\s*\|){3}\s*$/;
const TOKEN_TABLE_ROW = /^\|\s*`(--[a-z0-9-]+)`\s*\|\s*`([^`]+)`\s*\|([^|]*)\|\s*$/;
const DECLARATION = /(?<![\w-])(--[\w-]+)\s*:\s*([^;]+);/g;

export function splitFrontmatter(source: string): { yaml: string; body: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n/.exec(source);
  if (!match) throw new Error("DESIGN.md frontmatter를 찾을 수 없다");
  return { yaml: match[1], body: source.slice(match[0].length) };
}

export function readDesign(source: string, theme: TokenMap): ParsedDesign {
  const { yaml, body } = splitFrontmatter(source);
  const parsed = load(yaml) as Partial<DesignFrontmatter>;
  for (const key of ["colors", "rounded", "spacing", "typography"] as const) {
    if (parsed?.[key] === undefined || parsed[key] === null) throw new Error(`DESIGN.md frontmatter에 ${key} 맵이 없다`);
  }
  const frontmatter = parsed as DesignFrontmatter;
  const tokens = new Map<string, string>();
  for (const [key, value] of Object.entries(frontmatter.colors)) tokens.set(`--color-${key}`, value);
  for (const [key, value] of Object.entries(frontmatter.rounded)) tokens.set(`--radius-${key}`, value);
  for (const [key, value] of Object.entries(frontmatter.spacing)) {
    tokens.set(key.startsWith("container-") ? `--container-${key.slice(10)}` : `--spacing-${key}`, value);
  }
  const typographyErrors: string[] = [];
  const typographyPrefixes = {
    fontFamily: "--font-family-",
    fontSize: "--font-size-",
    lineHeight: "--line-height-",
    fontWeight: "--font-weight-",
    letterSpacing: "--tracking-",
  } as const;
  const hasValue = (prop: keyof typeof typographyPrefixes, value: unknown) =>
    [...theme].some(([token, entry]) => token.startsWith(typographyPrefixes[prop]) && normalize(entry) === normalize(String(value)));
  for (const [role, values] of Object.entries(frontmatter.typography)) {
    for (const prop of ["fontFamily", "fontSize", "lineHeight", "fontWeight", "letterSpacing"] as const) {
      const value = values[prop];
      if (value === undefined) continue;
      if (!hasValue(prop, value)) typographyErrors.push(`DESIGN.md typography.${role}.${prop} 값 "${value}"에 대응하는 ${typographyPrefixes[prop]}* 토큰이 @theme에 없다 — 토큰 표와 @theme에 먼저 추가하라`);
    }
  }
  const tableErrors: string[] = [];
  const lines = body.split("\n");
  const seen = new Set<string>();
  for (let i = 0; i < lines.length; i += 1) {
    if (!TOKEN_TABLE_HEADER.test(lines[i])) continue;
    i += 1;
    if (!TOKEN_TABLE_SEPARATOR.test(lines[i] ?? "")) tableErrors.push(`DESIGN.md 토큰 표 형식 오류 (${i + 1}행): "${lines[i] ?? ""}" — 형식: | \`--토큰\` | \`값\` | 용도 |`);
    for (i += 1; i < lines.length && lines[i].startsWith("|"); i += 1) {
      const row = TOKEN_TABLE_ROW.exec(lines[i]);
      if (!row) {
        tableErrors.push(`DESIGN.md 토큰 표 형식 오류 (${i + 1}행): "${lines[i]}" — 형식: | \`--토큰\` | \`값\` | 용도 |`);
        continue;
      }
      if (seen.has(row[1]) || tokens.has(row[1])) tableErrors.push(`DESIGN.md에 중복 정의된 토큰: ${row[1]} — frontmatter와 토큰 표 중 한 곳에만 둔다`);
      seen.add(row[1]);
      tokens.set(row[1], row[2]);
    }
    if (i < lines.length) i -= 1;
  }
  return { tokens, typographyErrors, tableErrors };
}

function normalize(value: string): string {
  return value.replace(/'/g, '"').replace(/\s+/g, " ").trim().toLowerCase();
}

function declarations(source: string): Map<string, string> {
  const tokens = new Map<string, string>();
  for (const match of source.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(DECLARATION)) tokens.set(match[1], match[2].trim());
  return tokens;
}

export function readTheme(source: string): { theme: Map<string, string>; scope: Map<string, string> } {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const theme = new Map<string, string>();
  const root = new Map<string, string>();
  for (const match of css.matchAll(/@theme\s*(?:inline\s*)?\{([^}]*)\}/g)) {
    for (const [key, value] of declarations(match[1])) theme.set(key, value);
  }
  const rootMatch = /:root\s*\{([^}]*)\}/.exec(css);
  if (rootMatch) for (const [key, value] of declarations(rootMatch[1])) root.set(key, value);
  return { theme, scope: new Map([...root, ...theme]) };
}

function resolveValue(value: string, scope: TokenMap, depth = 0): string {
  if (depth > 20) throw new Error("var() 순환 참조");
  const expanded = value.replace(/var\((--[\w-]+)\)/g, (_match, name: string) => {
    const target = scope.get(name);
    if (target === undefined) throw new Error(`var() 해석 실패: ${name}이 @theme·@theme inline·:root 어디에도 없다`);
    return resolveValue(target, scope, depth + 1);
  });
  const calc = /^calc\(\s*(-?(?:\d+\.)?\d+)(rem|px)\s*([+-])\s*(\d+(?:\.\d+)?)(rem|px)\s*\)$/.exec(expanded);
  if (!calc) return expanded;
  const left = Number(calc[1]) * (calc[2] === "rem" ? 16 : 1);
  const right = Number(calc[4]) * (calc[5] === "rem" ? 16 : 1);
  return `${left + (calc[3] === "+" ? right : -right)}px`;
}

function comparable(value: string): string {
  const normalized = normalize(value);
  const number = /^(-?(?:\d+\.)?\d+)(px|rem)$/.exec(normalized);
  return number ? `${Number(number[1]) * (number[2] === "rem" ? 16 : 1)}px` : normalized;
}

export function diffTokens(design: TokenMap, theme: TokenMap, scope: TokenMap): TokenDiff {
  const missingInTheme = [...design.keys()].filter((key) => !theme.has(key)).sort();
  const missingInDesign = [...theme.keys()].filter((key) => !design.has(key)).sort();
  const valueMismatches: ValueMismatch[] = [];
  for (const [token, designValue] of design) {
    const themeValue = theme.get(token);
    if (themeValue === undefined) continue;
    const resolved = resolveValue(themeValue, scope);
    if (comparable(designValue) !== comparable(resolved)) valueMismatches.push({ token, design: designValue, theme: resolved });
  }
  return { missingInTheme, missingInDesign, valueMismatches };
}

export function formatTokenDiff(diff: TokenDiff): string {
  const lines = [
    diff.missingInDesign.length && `DESIGN.md에 없는 @theme 토큰 ${diff.missingInDesign.length}개: {${diff.missingInDesign.join(", ")}} — DESIGN.md에 먼저 추가하고 @theme에 구현하라 (frontmatter colors/rounded/spacing 키 또는 정규 섹션 토큰 표 "| 토큰 | 값 | 용도 |")`,
    diff.missingInTheme.length && `@theme에 없는 DESIGN.md 토큰 ${diff.missingInTheme.length}개: {${diff.missingInTheme.join(", ")}} — globals.css @theme(또는 @theme inline)에 같은 이름·값으로 구현하라`,
    diff.valueMismatches.length && `값 불일치 ${diff.valueMismatches.length}건: ${diff.valueMismatches.map(({ token, design, theme }) => `${token} (DESIGN.md "${design}" / @theme "${theme}")`).join(", ")}`,
  ];
  return lines.filter(Boolean).join("\n");
}
