import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { REPO_URL } from "@/config/links";
import { HeroSection } from "@/view/home/sections/hero";

describe("HeroSection", () => {
  afterEach(() => vi.restoreAllMocks());

  it("히어로 제목이 스크롤 이동 대상일 때 tabIndex -1과 outline 제거를 가진다", () => {
    render(<HeroSection />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveAttribute("tabindex", "-1");
    expect(h1).toHaveClass("focus:outline-none");
  });

  it("히어로가 렌더될 때 h1과 lead가 시안 문구와 정확히 일치한다", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "2시간 안에 셋업하고 1주 안에 배포하는 풀스택 모노레포 스타터.",
      }),
    ).toHaveAttribute("id", "hero-title");
    expect(
      screen.getByText(
        "주니어도 시니어도 똑같이 빠르게 손에 익도록 만든 Turborepo 템플릿.",
      ),
    ).toBeInTheDocument();
  });

  it("GitHub에서 보기를 새 탭 외부 링크로 연다", () => {
    render(<HeroSection />);
    const link = screen.getByRole("link", { name: "GitHub에서 보기" });
    expect(link).toHaveAttribute("href", REPO_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("시작하기를 누를 때 quickstart 섹션으로 스크롤한다", () => {
    const quickstart = document.createElement("div");
    quickstart.id = "quickstart";
    document.body.append(quickstart);
    const scrollIntoView = vi.spyOn(quickstart, "scrollIntoView");
    render(<HeroSection />);
    fireEvent.click(screen.getByRole("button", { name: "시작하기" }));
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });
    quickstart.remove();
  });

  it("캡처 이미지가 즉시 로드되고 16:10 비율 클래스와 대체 텍스트를 가진다", () => {
    render(<HeroSection />);
    const img = screen.getByRole("img", { name: "디자인 시스템 가이드 첫 화면" });
    expect(img).not.toHaveAttribute("loading");
    expect(img).toHaveClass("aspect-16/10");
    expect(img).toHaveAttribute("width", "2560");
    expect(img).toHaveAttribute("height", "1600");
  });

  it("목표 목록이 두 항목일 때 값과 캡션을 표시하고 스택 줄을 보여 준다", () => {
    render(<HeroSection />);
    const list = screen.getByRole("list", { name: "핵심 목표" });
    expect(list.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("2시간 이내")).toBeInTheDocument();
    expect(screen.getByText("목표 2 · 첫 배포")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL 18")).toHaveClass("whitespace-nowrap");
  });
});
