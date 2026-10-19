import { Switch } from "@repo/ui/components/switch";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Switch", () => {
  it("role이 switch이고 aria-checked는 false로 시작한다", () => {
    render(<Switch aria-label="알림 토글" />);
    const sw = screen.getByRole("switch", { name: "알림 토글" });
    expect(sw).toBeInTheDocument();
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("클릭하면 aria-checked가 true로 토글된다", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="알림 토글" />);
    const sw = screen.getByRole("switch", { name: "알림 토글" });
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("disabled 상태이면 클릭해도 토글되지 않는다", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="알림 토글" disabled />);
    const sw = screen.getByRole("switch", { name: "알림 토글" });
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).toBeDisabled();
  });
});
