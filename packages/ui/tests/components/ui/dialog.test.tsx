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

  it("DialogContent가 열릴 때 반응형 가로 여백과 표준 세로 중앙 클래스를 적용한다", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByText("열기"));
    const classes = (await screen.findByTestId("dialog-content")).className.split(
      /\s+/,
    );

    expect(classes).toEqual(
      expect.arrayContaining([
        "inset-x-4",
        "mx-auto",
        "max-w-lg",
        "rounded-lg",
        "p-5",
        "tablet:p-6",
        "top-1/2",
        "-translate-y-1/2",
      ]),
    );
    for (const className of [
      "w-full",
      "translate-x-[-50%]",
      "sm:rounded-lg",
      "top-[50%]",
      "left-[50%]",
      "translate-y-[-50%]",
    ]) {
      expect(classes).not.toContain(className);
    }
  });

  it("Dialog 닫기 버튼이 모바일과 태블릿에서 요구된 클릭 영역을 제공할 때 한글 이름을 노출한다", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByText("열기"));
    const closeButton = await screen.findByRole("button", { name: "닫기" });

    expect(closeButton.className.split(/\s+/)).toEqual(
      expect.arrayContaining(["h-11", "w-11", "tablet:h-8", "tablet:w-8"]),
    );
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
