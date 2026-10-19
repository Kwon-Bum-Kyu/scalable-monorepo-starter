import { SimpleCheckboxGroup } from "@repo/ui/components/simple-checkbox-group";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const options = [
  { value: "red", label: "빨강" },
  { value: "green", label: "초록" },
  { value: "blue", label: "파랑" },
];

describe("SimpleCheckboxGroup", () => {
  it("value 배열에 포함된 옵션만 체크 상태로 렌더된다", () => {
    render(<SimpleCheckboxGroup options={options} value={["green"]} />);
    expect(screen.getByRole("checkbox", { name: "초록" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "빨강" })).not.toBeChecked();
  });

  it("체크 시 onChange가 누적된 value 배열로 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SimpleCheckboxGroup
        options={options}
        value={["green"]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "빨강" }));
    expect(onChange).toHaveBeenCalledWith(["green", "red"]);
  });

  it("이미 체크된 옵션을 다시 클릭하면 해제된 배열로 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SimpleCheckboxGroup
        options={options}
        value={["green", "blue"]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "초록" }));
    expect(onChange).toHaveBeenCalledWith(["blue"]);
  });
});
