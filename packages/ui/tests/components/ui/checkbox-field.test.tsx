import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CheckboxField } from "@repo/ui/components/checkbox-field";

describe("CheckboxField", () => {
  it("label이 체크박스와 id로 연결된다", () => {
    render(<CheckboxField id="agree" label="동의합니다" />);
    const checkbox = screen.getByRole("checkbox", { name: "동의합니다" });
    expect(checkbox).toHaveAttribute("id", "agree");
  });

  it("label 클릭 시 onCheckedChange가 호출된다", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxField
        id="tos"
        label="약관 동의"
        onCheckedChange={onCheckedChange}
      />
    );
    await user.click(screen.getByText("약관 동의"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("id를 생략하면 자동 생성된 id로 label과 연결된다", () => {
    render(<CheckboxField label="자동 id" />);
    const checkbox = screen.getByRole("checkbox", { name: "자동 id" });
    expect(checkbox.getAttribute("id")).toBeTruthy();
  });
});
