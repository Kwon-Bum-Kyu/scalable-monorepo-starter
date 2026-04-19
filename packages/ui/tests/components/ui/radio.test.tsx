import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "@repo/ui/components/radio-group";
import { Radio } from "@repo/ui/components/radio";

describe("Radio", () => {
  it("label과 radio가 같은 id로 연결된다", () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a" label="옵션 A" id="opt-a" />
      </RadioGroup>
    );
    const radio = screen.getByRole("radio", { name: "옵션 A" });
    expect(radio).toHaveAttribute("id", "opt-a");
  });

  it("id를 생략하면 value 기반 id가 자동 생성된다", () => {
    render(
      <RadioGroup defaultValue="b">
        <Radio value="hello" label="옵션" />
      </RadioGroup>
    );
    const radio = screen.getByRole("radio", { name: "옵션" });
    expect(radio.getAttribute("id")).toMatch(/hello/);
  });

  it("label 클릭 시 해당 라디오가 선택된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <Radio value="x" label="엑스" />
        <Radio value="y" label="와이" />
      </RadioGroup>
    );
    await user.click(screen.getByText("와이"));
    expect(onValueChange).toHaveBeenCalledWith("y");
  });
});
