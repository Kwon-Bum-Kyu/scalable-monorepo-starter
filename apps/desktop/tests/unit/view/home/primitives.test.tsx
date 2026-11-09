import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeSection, SectionHead } from "@/view/home/primitives";

describe("HomeSection", () => {
  it("id를 받을 때 aria-labelledby가 제목 id를 가리키는 section을 그린다", () => {
    const { container } = render(<HomeSection id="rules">내용</HomeSection>);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "rules");
    expect(section).toHaveAttribute("aria-labelledby", "rules-title");
    expect(section).not.toHaveClass("bg-secondary");
    expect(screen.getByText("내용").closest(".max-w-app")).not.toBeNull();
  });

  it("tinted일 때 bg-secondary 배경을 가진다", () => {
    const { container } = render(
      <HomeSection id="structure" tinted>
        내용
      </HomeSection>,
    );
    expect(container.querySelector("section")).toHaveClass("bg-secondary");
  });
});

describe("SectionHead", () => {
  it("제목이 스크롤 이동 대상일 때 tabIndex -1과 outline 제거를 가진다", () => {
    render(<SectionHead id="rules" eyebrow="규칙" title="규칙 제목" />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveAttribute("tabindex", "-1");
    expect(h2).toHaveClass("focus:outline-none");
  });

  it("제목을 받을 때 id가 `${id}-title`인 h2를 그린다", () => {
    render(<SectionHead id="rules" eyebrow="규칙" title="규칙 제목" />);
    expect(screen.getByRole("heading", { level: 2, name: "규칙 제목" })).toHaveAttribute(
      "id",
      "rules-title",
    );
    expect(screen.getByText("규칙")).toBeInTheDocument();
  });

  it("lead가 백틱을 포함할 때 code로 렌더한다", () => {
    render(<SectionHead id="x" eyebrow="e" title="t" lead="현행 `@theme` 토큰" />);
    expect(screen.getByText("@theme").tagName).toBe("CODE");
  });
});
