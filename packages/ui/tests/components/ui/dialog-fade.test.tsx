import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Dialog fade 애니메이션 정본 SSOT (Ralph R3c — 옵션 II fade + zoom-95)", () => {
  it("DialogContent는 fade-in-0/fade-out-0 + zoom-in-95/zoom-out-95를 사용한다", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>open</DialogTrigger>
        <DialogContent data-testid="content">
          <DialogTitle>t</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "open" }));
    const content = screen.getByTestId("content");
    expect(/data-\[state=open\]:fade-in-0/.test(content.className)).toBe(true);
    expect(/data-\[state=closed\]:fade-out-0/.test(content.className)).toBe(true);
    expect(/data-\[state=open\]:zoom-in-95/.test(content.className)).toBe(true);
    expect(/data-\[state=closed\]:zoom-out-95/.test(content.className)).toBe(true);
  });

  it("DialogContent는 slide 클래스를 사용하지 않는다 (정본 SSOT — 사용자 명시: fade in/out)", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>open</DialogTrigger>
        <DialogContent data-testid="content">
          <DialogTitle>t</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "open" }));
    const content = screen.getByTestId("content");
    expect(
      /slide-(in|out)/.test(content.className),
      `DialogContent는 slide 클래스를 사용하지 않아야 합니다 (사용자 명시 fade in/out) (실제: ${content.className})`,
    ).toBe(false);
  });
});
