import { describe, expect, it } from "vitest";

import {
  DS_ENTRY_TAGS,
  GUARDS,
  HERO,
  QUICKSTART_STEPS,
  ROOT_PILLARS,
  RULES,
} from "@/view/home/homeData";

describe("homeData", () => {
  it("시작하기가 01부터 04까지 네 단계일 때 번호가 순서대로 이어진다", () => {
    expect(QUICKSTART_STEPS.map((step) => step.number)).toEqual([
      "01",
      "02",
      "03",
      "04",
    ]);
  });

  it("2단계의 코드가 설치와 환경 변수 복사 두 줄일 때 줄바꿈으로 이어진다", () => {
    const step = QUICKSTART_STEPS[1];
    if (!("blocks" in step)) throw new Error("blocks 단계가 아니다");
    expect(step.blocks[0].code.map((s) => s.text).join("")).toBe(
      "npm install\ncp .env.example .env",
    );
  });

  it("3단계가 전체 기동을 먼저 둘 때 앱별 기동의 앱 이름이 변수 조각이다", () => {
    const step = QUICKSTART_STEPS[2];
    if (!("blocks" in step)) throw new Error("blocks 단계가 아니다");
    expect(step.blocks.map((b) => b.subtitle)).toEqual(["전체 기동", "앱별 기동"]);
    expect(step.blocks[0].code).toEqual([{ text: "npm run dev" }]);
    expect(step.blocks[1].code).toEqual([
      { text: "turbo run dev --filter=" },
      { text: "<web|api|storybook|desktop>", isVariable: true },
    ]);
  });

  it("4단계가 접속 안내일 때 서비스 네 개와 주소를 가진다", () => {
    const step = QUICKSTART_STEPS[3];
    if (!("services" in step)) throw new Error("services 단계가 아니다");
    expect(step.services).toHaveLength(4);
    expect(step.services[3]).toEqual({
      name: "Prisma Studio",
      url: "http://localhost:5555",
    });
  });

  it("규칙·가드·기둥·대표 항목이 시안 개수와 같다", () => {
    expect(RULES).toHaveLength(9);
    expect(GUARDS).toHaveLength(3);
    expect(ROOT_PILLARS).toHaveLength(4);
    expect(DS_ENTRY_TAGS).toHaveLength(5);
    expect(RULES[5].title).toBe("`@/` 별칭");
  });

  it("규칙 아홉 개가 시안 원문과 글자까지 같다", () => {
    expect(RULES).toEqual([
      { number: "01", title: "앱 간 직접 import 금지", description: "공유 코드는 `packages/*` 경유" },
      { number: "02", title: "shared-types 런타임 코드 금지", description: "순수 TypeScript 타입만" },
      { number: "03", title: "SQL 격리", description: "모든 DB 쿼리는 Repository 계층에만" },
      { number: "04", title: "파라미터화 쿼리", description: "Prisma Client 경유, raw 문자열 연결 금지" },
      { number: "05", title: "마이그레이션 불변", description: "기존 `*.sql` 수정 금지, 새 마이그레이션 생성" },
      { number: "06", title: "`@/` 별칭", description: "`apps/web`은 `@/` 별칭 필수, `../` 금지" },
      { number: "07", title: "TDD", description: "Red → Green → Refactor" },
      { number: "08", title: "`@theme` 토큰만 사용", description: "`@theme` 토큰만 사용, 하드코딩 금지" },
      {
        number: "09",
        title: "파일명 컨벤션",
        description: "React 컴포넌트 PascalCase, 훅·유틸 camelCase, API 레이어·shadcn 생성물 kebab-case",
      },
    ]);
  });

  it("가드 세 개가 시안 원문과 글자까지 같다", () => {
    expect(GUARDS).toEqual([
      { name: "architecture-guard", description: "9가지 아키텍처 불변 규칙을 코드에서 정적으로 스캔·검증하는 가드." },
      {
        name: "lint-enforcer",
        description: "전체 워크스페이스의 `turbo run lint`를 실행하여 ESLint error와 warning을 0건으로 수렴시키는 집행자.",
      },
      { name: "tdd-guide", description: "Red-Green-Refactor 사이클을 강제하는 TDD 코치." },
    ]);
  });

  it("히어로 lead가 시안 문구와 정확히 일치한다", () => {
    expect(HERO.lead).toBe(
      "주니어도 시니어도 똑같이 빠르게 손에 익도록 만든 Turborepo 템플릿.",
    );
    expect(HERO.goals).toEqual([
      { value: "2시간 이내", caption: "목표 1 · 셋업" },
      { value: "1주일 이내", caption: "목표 2 · 첫 배포" },
    ]);
  });
});
