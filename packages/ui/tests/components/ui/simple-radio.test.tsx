import { SimpleRadio } from "@repo/ui/components/simple-radio";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const options = [
  { value: "a", label: "옵션 A" },
  { value: "b", label: "옵션 B" },
  { value: "c", label: "옵션 C", disabled: true },
];

describe("SimpleRadio", () => {
  it("options 배열 길이만큼 radio가 렌더된다", () => {
    render(<SimpleRadio options={options} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("옵션 선택 시 onValueChange가 선택된 값으로 호출된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SimpleRadio options={options} onValueChange={onValueChange} />);
    await user.click(screen.getByText("옵션 B"));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("disabled 옵션은 비활성화된다", () => {
    render(<SimpleRadio options={options} />);
    const radioC = screen.getByRole("radio", { name: "옵션 C" });
    expect(radioC).toBeDisabled();
  });
});
