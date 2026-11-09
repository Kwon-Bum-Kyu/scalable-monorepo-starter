import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
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

const LocationState = () => (
  <output aria-label="location-state">{JSON.stringify(useLocation().state)}</output>
);

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

  it("[홈 화면]이 렌더될 때 규칙 아홉 개와 가드 세 개와 가이드 링크를 표시한다", () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(container.querySelectorAll("#rules ol > li")).toHaveLength(9);
    expect(
      screen.getByRole("complementary", { name: "AI 가드" }).querySelectorAll("p.font-mono"),
    ).toHaveLength(3);
    expect(
      screen.getByRole("link", { name: "디자인 시스템 가이드 보기" }),
    ).toHaveAttribute("href", "/guide");
  });

  it("[홈 화면]에서 히어로가 문구 열과 캡처 열로 나뉠 때 각각 desktop 6열을 차지한다", () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(container.querySelectorAll("#hero .desktop\\:col-span-6")).toHaveLength(2);
  });

  it("[홈 화면]에서 시작하기를 누를 때 quickstart 섹션으로 스크롤한다", () => {
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "시작하기" }));

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });
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
        <LocationState />
      </MemoryRouter>,
    );

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });
    expect(screen.getByText("null", { selector: "output" })).toBeInTheDocument();
  });
});
