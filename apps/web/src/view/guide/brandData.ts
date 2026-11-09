import type { SystemIconName } from "@repo/ui";
import horizontal from "@repo/ui/assets/brand/logo/lockup-horizontal.svg";
import horizontalDark from "@repo/ui/assets/brand/logo/lockup-horizontal-dark.svg";
import stacked from "@repo/ui/assets/brand/logo/lockup-stacked.svg";
import stackedDark from "@repo/ui/assets/brand/logo/lockup-stacked-dark.svg";
import symbol from "@repo/ui/assets/brand/logo/symbol.svg";
import symbolDark from "@repo/ui/assets/brand/logo/symbol-dark.svg";
import wordmark from "@repo/ui/assets/brand/logo/wordmark.svg";
import wordmarkDark from "@repo/ui/assets/brand/logo/wordmark-dark.svg";
import actionBlue from "@repo/ui/assets/brand/misuse/action-blue-background.svg";
import attachedPillar from "@repo/ui/assets/brand/misuse/attached-pillar.svg";
import colorRole from "@repo/ui/assets/brand/misuse/color-role.svg";

export interface LogoVariant {
  key: "symbol" | "wordmark" | "lockup-horizontal" | "lockup-stacked";
  name: string; usage: string; file: string;
  lightSrc: string; darkSrc: string; lightAlt: string; darkAlt: string;
  width: number; height: number;
}

export const LOGO_VARIANTS: ReadonlyArray<LogoVariant> = [
  { key: "symbol", name: "심볼", usage: "아바타, 앱 아이콘, 탭 아이콘", file: "symbol(-dark).svg", lightSrc: symbol, darkSrc: symbolDark, lightAlt: "심볼, 밝은 배경용", darkAlt: "심볼, 어두운 배경용", width: 80, height: 64 },
  { key: "wordmark", name: "워드마크", usage: "같은 화면에 심볼이 이미 있을 때만 단독 사용", file: "wordmark(-dark).svg", lightSrc: wordmark, darkSrc: wordmarkDark, lightAlt: "워드마크, 밝은 배경용", darkAlt: "워드마크, 어두운 배경용", width: 200, height: 16 },
  { key: "lockup-horizontal", name: "가로 조합", usage: "기본 버전. README, 문서 헤더, 웹 내비게이션", file: "lockup-horizontal(-dark).svg", lightSrc: horizontal, darkSrc: horizontalDark, lightAlt: "가로 조합, 밝은 배경용", darkAlt: "가로 조합, 어두운 배경용", width: 200, height: 14 },
  { key: "lockup-stacked", name: "세로 조합", usage: "스플래시 화면, 문서 표지", file: "lockup-stacked(-dark).svg", lightSrc: stacked, darkSrc: stackedDark, lightAlt: "세로 조합, 밝은 배경용", darkAlt: "세로 조합, 어두운 배경용", width: 160, height: 45 },
];

export const CONCEPT_ROWS = [
  { term: "보", meaning: "저장소 루트 하나와 공유 패키지(`packages/ui`, `packages/shared-types`). 단일 출처." },
  { term: "잉크 기둥", meaning: "이미 연결된 워크스페이스(web, api, desktop, storybook)." },
  { term: "파란 기둥", meaning: "사용자가 이 스타터 위에 올릴 다음 앱. 시작점(starter)과 확장(scalable)." },
  { term: "틈", meaning: "워크스페이스 경계를 명시적으로 선언한다는 원칙." },
] as const;

export const MIN_SIZES = [
  { part: "심볼", size: "높이 16px(너비 20px)" },
  { part: "워드마크", size: "너비 160px" },
  { part: "가로 조합", size: "너비 180px" },
  { part: "세로 조합", size: "너비 160px" },
] as const;

export interface MisuseExample {
  title: string; description: string; src: string | null; alt: string;
  artClassName: string; imgClassName: string; fill?: boolean;
}

export const MISUSE_EXAMPLES: ReadonlyArray<MisuseExample> = [
  { title: "비율 왜곡", description: "로고를 가로나 세로로만 늘리거나 줄이지 않습니다.", src: symbol, alt: "가로로 늘린 심볼", artClassName: "bg-background", imgClassName: "h-16 w-40" },
  { title: "색 역할 바꾸기", description: "파란색은 세 번째 기둥에만 씁니다.", src: colorRole, alt: "보를 파랗게 칠한 심볼", artClassName: "bg-background", imgClassName: "h-20 w-25" },
  { title: "형태 바꾸기", description: "틈이 사라지면 명시적 경계라는 의미도 사라집니다.", src: attachedPillar, alt: "파란 기둥을 보에 붙인 심볼", artClassName: "bg-background", imgClassName: "h-20 w-25" },
  { title: "낮은 대비", description: "어두운 배경에 기본(잉크) 버전을 쓰지 않습니다.", src: symbol, alt: "Graphite 배경 위에 놓인 잉크 버전 심볼", artClassName: "border-gray-700 bg-gray-700", imgClassName: "h-20 w-25" },
  { title: "Action Blue 배경", description: "파란 기둥이 배경과 같은 색이 되어 보이지 않습니다.", src: actionBlue, alt: "Action Blue 배경 위에 놓인 다크 버전 심볼", artClassName: "bg-background", imgClassName: "h-28 w-full object-cover", fill: true },
  { title: "워드마크 다시 입력하기", description: "항상 `wordmark.svg` 또는 조합 파일을 씁니다.", src: null, alt: "", artClassName: "bg-background", imgClassName: "" },
];

export const SYSTEM_ICON_SAMPLES: ReadonlyArray<SystemIconName> = ["github", "linkedin", "envelope-outline"];
export const SYSTEM_ICON_NAMES: ReadonlyArray<SystemIconName> = [
  "bars", "search", "info", "close", "circle", "circle-filled", "eye", "eye-slash",
  "chevron-right", "chevron-left", "chevron-up", "chevron-down", "toggle-on", "toggle-off",
  "user", "user-circle", "user-outline", "envelope", "caret-up", "caret-down", "arrow-up",
  "arrow-down", "arrow-left", "arrow-right", "check-square", "check-square-outline",
  "check-circle", "check-circle-outline", "square", "square-outline", "globe", "copy", "octagon-x",
];

export const BRAND_FILES = [
  { file: "logo/symbol.svg · symbol-dark.svg", usage: "심볼 단독(100 × 80)" },
  { file: "logo/wordmark.svg · wordmark-dark.svg", usage: "워드마크 단독, 글자 윤곽 path" },
  { file: "logo/lockup-horizontal.svg · lockup-horizontal-dark.svg", usage: "가로 조합, 기본 버전" },
  { file: "logo/lockup-stacked.svg · lockup-stacked-dark.svg", usage: "세로 조합" },
  { file: "applications/favicon.svg", usage: "브라우저 탭 아이콘(16 · 32px 보정)" },
  { file: "applications/app-icon.svg", usage: "Electron 데스크톱 앱 아이콘 원본(1024 × 1024)" },
  { file: "applications/readme-header.svg", usage: "GitHub README 상단 헤더(1280 × 320)" },
  { file: "applications/og-image.svg", usage: "GitHub 소셜 미리보기 원본(1280 × 640)" },
  { file: "fonts/", usage: "Open Sans, Roboto Mono 웹폰트와 라이선스" },
] as const;

export { symbol as BRAND_SYMBOL_SRC };
