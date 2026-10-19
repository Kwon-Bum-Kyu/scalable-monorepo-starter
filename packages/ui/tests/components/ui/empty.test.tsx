import { Empty } from "@repo/ui/components/empty";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Empty", () => {
  it("title과 description이 렌더된다", () => {
    render(<Empty title="비었음" description="데이터가 없습니다" />);
    expect(screen.getByText("비었음")).toBeInTheDocument();
    expect(screen.getByText("데이터가 없습니다")).toBeInTheDocument();
  });

  it("action 슬롯이 렌더된다", () => {
    render(
      <Empty
        title="비었음"
        action={<button type="button">새로 만들기</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "새로 만들기" }),
    ).toBeInTheDocument();
  });

  it("icon 슬롯이 렌더된다", () => {
    render(<Empty title="비었음" icon={<span data-testid="icon">🗂️</span>} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
