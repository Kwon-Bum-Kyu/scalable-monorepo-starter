import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "@/view/Home";

const sectionContracts = [
  ["hero", "2시간 안에 셋업하고 1주 안에 배포하는 풀스택 모노레포 스타터."],
  ["structure", "공유 루트"],
  ["quickstart", "네 단계로 로컬 개발 환경을 띄웁니다."],
  ["rules", "바꾸지 않는 규칙 아홉 가지."],
  [
    "design-system",
    "토큰과 컴포넌트, 브랜드 규칙은 가이드에서 확인합니다.",
  ],
] as const;

describe("Home", () => {
  afterEach(() => vi.restoreAllMocks());

  it("[홈 화면]이 렌더될 때 한 개의 주 제목과 다섯 섹션을 표시한다", () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(4);
    for (const [id, title] of sectionContracts) {
      const section = container.querySelector(`#${id}`);
      expect(section).not.toBeNull();
      expect(section).toHaveAttribute("aria-labelledby", `${id}-title`);
      expect(screen.getByRole("heading", { name: title })).toHaveAttribute(
        "id",
        `${id}-title`,
      );
    }
  });

  it("[홈 화면]이 이동 상태를 받을 때 요청한 섹션으로 스크롤한다", () => {
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/", state: { scrollTo: "quickstart" } },
        ]}
      >
        <Home />
      </MemoryRouter>,
    );

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });
  });
});
