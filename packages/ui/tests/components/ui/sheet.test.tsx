import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

const TestSheet = ({ side }: { side?: "top" | "right" | "bottom" | "left" }) => (
  <Sheet>
    <SheetTrigger>열기</SheetTrigger>
    <SheetContent side={side} data-testid="sheet-content">
      <SheetTitle>제목</SheetTitle>
      <SheetDescription>설명</SheetDescription>
      <p>본문</p>
    </SheetContent>
  </Sheet>
);

describe("Sheet", () => {
  it("기본 상태에서 trigger만 노출되고 content는 숨겨진다", () => {
    render(<TestSheet />);
    expect(screen.getByText("열기")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("trigger를 클릭하면 SheetContent가 등장한다", async () => {
    const user = userEvent.setup();
    render(<TestSheet />);
    await user.click(screen.getByText("열기"));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("side가 left일 때 좌측 슬라이드 클래스를 갖는다", async () => {
    const user = userEvent.setup();
    render(<TestSheet side="left" />);
    await user.click(screen.getByText("열기"));
    const content = await screen.findByTestId("sheet-content");
    expect(content.className).toMatch(/slide-in-from-left/);
  });

  it("열린 SheetContent는 elevation 4단계(overlay) 토큰을 적용한다", async () => {
    const user = userEvent.setup();
    render(<TestSheet />);
    await user.click(screen.getByText("열기"));
    const content = await screen.findByTestId("sheet-content");
    expect(content.className).toContain("shadow-4-overlay");
    expect(content.className).not.toContain("shadow-lg");
  });

  it("ESC 키로 닫을 수 있다", async () => {
    const user = userEvent.setup();
    render(<TestSheet />);
    await user.click(screen.getByText("열기"));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
