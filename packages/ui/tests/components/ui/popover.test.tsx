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
      </Popover>
    );
    expect(screen.getByText("열기")).toBeInTheDocument();
  });

  it("기본 상태에서 content는 표시되지 않는다", () => {
    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent>내용</PopoverContent>
      </Popover>
    );
    expect(screen.queryByText("내용")).not.toBeInTheDocument();
  });
});
