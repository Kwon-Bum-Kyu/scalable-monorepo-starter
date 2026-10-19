import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Popover", () => {
  it("기본 trigger가 렌더된다", () => {
    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent>내용</PopoverContent>
      </Popover>,
    );
    expect(screen.getByText("열기")).toBeInTheDocument();
  });

  it("기본 상태에서 content는 표시되지 않는다", () => {
    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent>내용</PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText("내용")).not.toBeInTheDocument();
  });

  it("열린 상태의 content는 elevation 3단계(raised) 토큰을 적용한다", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent data-testid="pop-content">내용</PopoverContent>
      </Popover>,
    );

    const content = screen.getByTestId("pop-content");
    expect(content.className).toContain("shadow-3-raised");
    expect(content.className).not.toContain("shadow-md");
  });
});
