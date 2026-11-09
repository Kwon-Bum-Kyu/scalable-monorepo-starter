export interface CodeSegment {
  text: string;
  isVariable?: boolean;
}

export type QuickstartStep =
  | {
      number: "01" | "02" | "03";
      title: string;
      blocks: ReadonlyArray<{
        subtitle?: string;
        code: ReadonlyArray<CodeSegment>;
        help: string;
      }>;
    }
  | {
      number: "04";
      title: string;
      services: ReadonlyArray<{ name: string; url: string }>;
      help: string;
    };

export const HERO = {
  title: "2시간 안에 셋업하고 1주 안에 배포하는 풀스택 모노레포 스타터.",
  lead: "주니어도 시니어도 똑같이 빠르게 손에 익도록 만든 Turborepo 템플릿.",
  goals: [
    { value: "2시간 이내", caption: "목표 1 · 셋업" },
    { value: "1주일 이내", caption: "목표 2 · 첫 배포" },
  ],
  stack: [
    "React 19",
    "Vite 8",
    "Tailwind CSS 4",
    "Express 5",
    "Prisma 7",
    "PostgreSQL 18",
    "Turborepo 2.9",
    "TypeScript 6",
  ],
} as const;

export const ROOT_BEAM = {
  name: "packages/*",
  description: "보 · 단일 출처 공유 패키지",
  packages: [
    "ui",
    "shared-types",
    "eslint-config",
    "typescript-config",
    "vitest-config",
  ],
} as const;

export const ROOT_PILLARS = [
  { name: "apps/web", port: ":3000", description: "React · Vite 웹 앱" },
  { name: "apps/api", port: ":4000", description: "Express · Prisma API" },
  { name: "apps/storybook", port: ":6006", description: "컴포넌트 카탈로그" },
  { name: "apps/desktop", port: ":3100", description: "Electron 데스크톱 앱" },
] as const;

export const NEXT_PILLAR = {
  name: "다음 앱",
  description: "사용자가 추가하는 워크스페이스",
  badge: "apps/*",
} as const;

export const ROOT_KEYS = [
  {
    term: "보",
    description: "저장소 루트 하나와 공유 패키지입니다. 값과 규칙의 단일 출처입니다.",
  },
  {
    term: "기둥",
    description: "이미 연결된 워크스페이스입니다. 보에 붙어 같은 규칙을 공유합니다.",
  },
  {
    term: "틈",
    description:
      "다음 앱은 보에서 떨어져 있습니다. 그 틈이 곧 명시적으로 선언한 워크스페이스 경계입니다.",
  },
] as const;

export const QUICKSTART_STEPS: ReadonlyArray<QuickstartStep> = [
  {
    number: "01",
    title: "템플릿 가져오기",
    blocks: [
      {
        code: [
          { text: "npx degit " },
          { text: "<your-org>", isVariable: true },
          { text: "/scalable-monorepo-starter my-project" },
        ],
        help: "`<your-org>`를 템플릿을 올린 GitHub 조직 이름으로 바꿉니다.",
      },
    ],
  },
  {
    number: "02",
    title: "설치와 환경 변수",
    blocks: [
      {
        code: [{ text: "npm install\ncp .env.example .env" }],
        help: "`.env`의 `DATABASE_URL`을 설정합니다.",
      },
    ],
  },
  {
    number: "03",
    title: "개발 서버 기동",
    blocks: [
      {
        subtitle: "전체 기동",
        code: [{ text: "npm run dev" }],
        help: "Docker Postgres를 기동하고 Prisma 마이그레이션을 적용한 뒤 web · api · storybook · desktop · Prisma Studio를 함께 띄웁니다.",
      },
      {
        subtitle: "앱별 기동",
        code: [
          { text: "turbo run dev --filter=" },
          { text: "<web|api|storybook|desktop>", isVariable: true },
        ],
        help: "필요한 앱 하나만 띄웁니다. `--filter` 뒤에 앱 이름을 넣습니다.",
      },
    ],
  },
  {
    number: "04",
    title: "접속",
    services: [
      { name: "Web", url: "http://localhost:3000" },
      { name: "API", url: "http://localhost:4000" },
      { name: "Storybook", url: "http://localhost:6006" },
      { name: "Prisma Studio", url: "http://localhost:5555" },
    ],
    help: "desktop은 브라우저 주소가 아니라 Electron 창으로 열립니다.",
  },
] as const satisfies ReadonlyArray<QuickstartStep>;

export const RULES = [
  {
    number: "01",
    title: "앱 간 직접 import 금지",
    description: "공유 코드는 `packages/*` 경유",
  },
  {
    number: "02",
    title: "shared-types 런타임 코드 금지",
    description: "순수 TypeScript 타입만",
  },
  {
    number: "03",
    title: "SQL 격리",
    description: "모든 DB 쿼리는 Repository 계층에만",
  },
  {
    number: "04",
    title: "파라미터화 쿼리",
    description: "Prisma Client 경유, raw 문자열 연결 금지",
  },
  {
    number: "05",
    title: "마이그레이션 불변",
    description: "기존 `*.sql` 수정 금지, 새 마이그레이션 생성",
  },
  {
    number: "06",
    title: "`@/` 별칭",
    description: "`apps/web`은 `@/` 별칭 필수, `../` 금지",
  },
  { number: "07", title: "TDD", description: "Red → Green → Refactor" },
  {
    number: "08",
    title: "`@theme` 토큰만 사용",
    description: "`@theme` 토큰만 사용, 하드코딩 금지",
  },
  {
    number: "09",
    title: "파일명 컨벤션",
    description:
      "React 컴포넌트 PascalCase, 훅·유틸 camelCase, API 레이어·shadcn 생성물 kebab-case",
  },
] as const;

export const GUARDS = [
  {
    name: "architecture-guard",
    description: "9가지 아키텍처 불변 규칙을 코드에서 정적으로 스캔·검증하는 가드.",
  },
  {
    name: "lint-enforcer",
    description:
      "전체 워크스페이스의 `turbo run lint`를 실행하여 ESLint error와 warning을 0건으로 수렴시키는 집행자.",
  },
  {
    name: "tdd-guide",
    description: "Red-Green-Refactor 사이클을 강제하는 TDD 코치.",
  },
] as const;

export const DS_ENTRY_TAGS = [
  "원칙",
  "컬러",
  "타이포그래피",
  "기본 컴포넌트",
  "브랜드",
] as const;
