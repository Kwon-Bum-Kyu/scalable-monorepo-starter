import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RulesSection } from "@/view/home/sections/rules";

describe("RulesSection", () => {
  it("규칙 섹션이 렌더될 때 제목과 tinted 배경을 가진다", () => {
    const { container } = render(<RulesSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: "바꾸지 않는 규칙 아홉 가지." }),
    ).toHaveAttribute("id", "rules-title");
    expect(container.querySelector("section#rules")).toHaveClass("bg-secondary");
  });

  it("규칙 목록이 아홉 항목이고 위쪽 굵은 선을 가진다", () => {
    render(<RulesSection />);
    const rules = screen.getAllByRole("listitem");
    expect(rules).toHaveLength(9);
    expect(rules[0]).toHaveClass("border-t-2", "border-foreground");
    expect(screen.getByText("packages/*").tagName).toBe("CODE");
    expect(screen.getByText("순수 TypeScript 타입만")).toBeInTheDocument();
    expect(screen.getByText("Red → Green → Refactor")).toBeInTheDocument();
  });

  it("규칙 아홉 개의 번호·제목·설명이 시안 원문대로 렌더된다", () => {
    render(<RulesSection />);
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "01앱 간 직접 import 금지공유 코드는 packages/* 경유",
      "02shared-types 런타임 코드 금지순수 TypeScript 타입만",
      "03SQL 격리모든 DB 쿼리는 Repository 계층에만",
      "04파라미터화 쿼리Prisma Client 경유, raw 문자열 연결 금지",
      "05마이그레이션 불변기존 *.sql 수정 금지, 새 마이그레이션 생성",
      "06@/ 별칭apps/web은 @/ 별칭 필수, ../ 금지",
      "07TDDRed → Green → Refactor",
      "08@theme 토큰만 사용@theme 토큰만 사용, 하드코딩 금지",
      "09파일명 컨벤션React 컴포넌트 PascalCase, 훅·유틸 camelCase, API 레이어·shadcn 생성물 kebab-case",
    ]);
  });

  it("AI 가드 세 개의 이름과 설명이 시안 원문대로 렌더된다", () => {
    render(<RulesSection />);
    const aside = screen.getByRole("complementary", { name: "AI 가드" });
    expect(within(aside).getByText("lint-enforcer").nextElementSibling?.textContent).toBe(
      "전체 워크스페이스의 turbo run lint를 실행하여 ESLint error와 warning을 0건으로 수렴시키는 집행자.",
    );
    expect(within(aside).getByText("tdd-guide").nextElementSibling?.textContent).toBe(
      "Red-Green-Refactor 사이클을 강제하는 TDD 코치.",
    );
    expect(within(aside).getByText("architecture-guard").nextElementSibling?.textContent).toBe(
      "9가지 아키텍처 불변 규칙을 코드에서 정적으로 스캔·검증하는 가드.",
    );
  });

  it("AI 가드 영역이 가드 세 개의 설명 첫 문장을 보여 준다", () => {
    render(<RulesSection />);
    const aside = screen.getByRole("complementary", { name: "AI 가드" });
    expect(within(aside).getByText("규칙을 검사하는 AI 가드")).toBeInTheDocument();
    expect(
      within(aside).getByText(
        "9가지 아키텍처 불변 규칙을 코드에서 정적으로 스캔·검증하는 가드.",
      ),
    ).toBeInTheDocument();
    expect(within(aside).getByText("tdd-guide")).toBeInTheDocument();
    expect(within(aside).getByText("turbo run lint").tagName).toBe("CODE");
  });
});
