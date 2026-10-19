import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

const TestDialog = () => (
  <Dialog>
    <DialogTrigger>열기</DialogTrigger>
    <DialogContent data-testid="dialog-content">
      <DialogTitle>제목</DialogTitle>
      <DialogDescription>설명</DialogDescription>
      <p>본문</p>
    </DialogContent>
  </Dialog>
);

describe("Dialog", () => {
  it("기본 상태에서 trigger만 노출되고 content는 숨겨진다", () => {
    render(<TestDialog />);
    expect(screen.getByText("열기")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("trigger를 클릭하면 role=dialog가 등장한다", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByText("열기"));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("열린 dialog에 aria-labelledby와 aria-describedby가 연결된다", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByText("열기"));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
  });

  it("열린 DialogContent는 elevation 4단계(overlay) 토큰을 적용한다", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByText("열기"));
    const content = await screen.findByTestId("dialog-content");
    expect(content.className).toContain("shadow-4-overlay");
    expect(content.className).not.toContain("shadow-lg");
  });

  it("ESC 키를 누르면 dialog가 닫힌다", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByText("열기"));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
