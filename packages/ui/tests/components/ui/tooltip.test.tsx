import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Tooltip", () => {
  it("기본 trigger가 렌더된다", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent>설명 텍스트</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByText("도움말")).toBeInTheDocument();
  });

  it("기본 상태에서 content는 표시되지 않는다", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent>설명 텍스트</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.queryByText("설명 텍스트")).not.toBeInTheDocument();
  });

  it("defaultOpen이 true이면 content가 즉시 표시된다", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent data-testid="tt-content">설명 텍스트</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByTestId("tt-content")).toHaveTextContent("설명 텍스트");
  });

  it("열린 상태의 content는 토큰 기반 배경과 컨테이너 radius를 적용한다", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent data-testid="tt-content">설명 텍스트</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const content = screen.getByTestId("tt-content");
    expect(content.className).toContain("bg-popover");
    expect(content.className).toContain("text-popover-foreground");
    expect(content.className).toContain("rounded-md");
  });

  it("열린 상태의 content는 elevation 3단계(raised) 토큰을 적용한다", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent data-testid="tt-content">설명 텍스트</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const content = screen.getByTestId("tt-content");
    expect(content.className).toContain("shadow-3-raised");
    expect(content.className).not.toContain("shadow-md");
  });

  it("trigger는 button 역할로 키보드 접근이 가능하다", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent>설명 텍스트</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const trigger = screen.getByRole("button", { name: "도움말" });
    expect(trigger).toBeInTheDocument();
  });
});
