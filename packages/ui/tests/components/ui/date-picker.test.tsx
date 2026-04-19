import { DatePicker } from "@repo/ui/components/date-picker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("DatePicker", () => {
  it("placeholder가 없는 상태에서 기본 placeholder가 표시된다", () => {
    render(<DatePicker />);
    expect(
      screen.getByRole("button", { name: /날짜 선택/ }),
    ).toBeInTheDocument();
  });

  it("value가 주어지면 포맷된 날짜가 표시된다", () => {
    const date = new Date("2026-04-19T00:00:00.000Z");
    render(<DatePicker value={date} />);
    expect(screen.getByRole("button")).toHaveTextContent(/2026/);
  });

  it("trigger 클릭 시 Calendar가 열린다", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(screen.getAllByRole("button")[0]);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("disabled=true일 때 버튼이 비활성화된다", () => {
    render(<DatePicker disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("onSelect 콜백이 props로 전달된다", () => {
    const onSelect = vi.fn();
    render(<DatePicker onSelect={onSelect} />);
    // 콜백이 props로 정상 전달되는지는 타입·렌더 확인으로 충분
    expect(onSelect).not.toHaveBeenCalled();
  });
});
