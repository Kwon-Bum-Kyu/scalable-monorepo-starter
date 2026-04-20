import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Guide from "@/view/guide";

const renderGuide = () =>
  render(
    <MemoryRouter>
      <Guide />
    </MemoryRouter>,
  );

describe("Guide 페이지", () => {
  it("Typography 제목들이 모두 렌더링된다", () => {
    renderGuide();
    expect(screen.getByText("H1 Title")).toBeInTheDocument();
    expect(screen.getByText("H2 Title")).toBeInTheDocument();
  });

  it("ButtonGroup의 'Button 1' 버튼이 노출되어 있다", () => {
    renderGuide();
    expect(screen.getByRole("button", { name: "Button 1" })).toBeVisible();
  });

  it("Empty 컴포넌트 3종이 동시에 렌더링된다", () => {
    renderGuide();
    expect(screen.getByText("데이터가 없습니다")).toBeInTheDocument();
    expect(screen.getByText("비어있는 상태")).toBeInTheDocument();
    expect(screen.getByText("결과 없음")).toBeInTheDocument();
  });
});
