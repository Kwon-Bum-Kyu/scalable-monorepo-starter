import { Typography } from "@repo/ui/components/typography";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Typography", () => {
  it("variant가 h1일 때 h1 태그로 렌더된다", () => {
    render(<Typography variant="h1">제목</Typography>);
    const heading = screen.getByRole("heading", { level: 1, name: "제목" });
    expect(heading.tagName).toBe("H1");
  });

  it("as prop으로 태그를 강제할 수 있다", () => {
    render(
      <Typography variant="h1" as="span" data-testid="forced">
        span 제목
      </Typography>
    );
    const node = screen.getByTestId("forced");
    expect(node.tagName).toBe("SPAN");
  });

  it("className이 cn 유틸을 통해 병합된다", () => {
    render(
      <Typography variant="body" className="text-center">
        본문
      </Typography>
    );
    expect(screen.getByText("본문")).toHaveClass("text-center");
  });

  it("variant 기본값은 body이고 p 태그로 렌더된다", () => {
    render(<Typography data-testid="default">기본</Typography>);
    expect(screen.getByTestId("default").tagName).toBe("P");
  });
});
