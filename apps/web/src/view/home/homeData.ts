export interface CodeSegment {
  text: string;
  isVariable?: boolean;
}

interface CommandBlock {
  code: ReadonlyArray<CodeSegment>;
  help: ReadonlyArray<string>;
}

export type QuickstartStep =
  | {
      number: "01";
      title: string;
      create: CommandBlock;
      version: CommandBlock & {
        subtitle: string;
        findHelp: { before: string; linkLabel: string; after: string };
        releasesUrl: string;
      };
    }
  | {
      number: "02";
      title: string;
      code: ReadonlyArray<CodeSegment>;
      help: string;
      commands: ReadonlyArray<{ command: string; apps: string; precondition: string }>;
      note: string;
    }
  | {
      number: "03";
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
    title: "프로젝트 만들기",
    create: {
      code: [{ text: "npm create scalable-monorepo-starter@latest" }],
      help: [
        "프로젝트 이름과 설치할 앱(api, web, desktop, storybook)을 고르면 템플릿 내려받기, 의존성 설치, `.env` 생성, git 저장소 만들기까지 한 번에 끝납니다.",
        "Node.js 22.13 이상이 필요합니다.",
      ],
    },
    version: {
      subtitle: "다른 버전으로 만들기",
      code: [
        { text: "npm create scalable-monorepo-starter@" },
        { text: "1.2.0", isVariable: true },
      ],
      help: [
        "`@latest` 자리에 버전 번호를 씁니다. CLI와 템플릿은 같은 번호로 함께 릴리스되므로 이 번호가 곧 템플릿 버전입니다.",
      ],
      findHelp: {
        before:
          "고를 수 있는 버전은 `npm view create-scalable-monorepo-starter versions`나 저장소의 ",
        linkLabel: "Releases",
        after: "에서 확인합니다.",
      },
      releasesUrl:
        "https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter/releases",
    },
  },
  {
    number: "02",
    title: "필요한 앱 띄우기",
    code: [
      { text: "cd " },
      { text: "my-app", isVariable: true },
      { text: "\nnpm run dev:web" },
    ],
    help: "`my-app` 자리에는 01에서 입력한 프로젝트 이름이 들어갑니다. 아래 명령 중 필요한 것만 실행합니다.",
    commands: [
      { command: "npm run dev:api", apps: "api, Prisma Studio", precondition: "Docker 실행 중" },
      { command: "npm run dev:web", apps: "web", precondition: "없음" },
      {
        command: "npm run dev:desktop",
        apps: "desktop(Electron 창)",
        precondition: "없음. 기동 전에 자동으로 빌드합니다.",
      },
      { command: "npm run dev:storybook", apps: "storybook", precondition: "없음" },
      { command: "npm run dev", apps: "설치한 앱 모두", precondition: "api가 있으면 Docker" },
    ],
    note: "설치하지 않은 앱의 명령은 프로젝트에 없습니다. 외부 DB(Neon 등)를 쓸 때는 `.env`의 `DATABASE_URL`을 바꾸고 `SKIP_DEV_BOOTSTRAP=1`을 설정합니다.",
  },
  {
    number: "03",
    title: "접속",
    services: [
      { name: "Web", url: "http://localhost:3000" },
      { name: "API", url: "http://localhost:4000" },
      { name: "Storybook", url: "http://localhost:6006" },
      { name: "Prisma Studio", url: "http://localhost:5555" },
    ],
    help: "설치하고 띄운 앱의 주소만 열립니다. desktop은 브라우저 주소가 아니라 Electron 창으로 열립니다.",
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
