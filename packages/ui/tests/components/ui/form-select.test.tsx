import { FormSelect } from "@repo/ui/components/form-select";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const options = [
  { label: "사과", value: "apple" },
  { label: "바나나", value: "banana" },
];

describe("FormSelect", () => {
  it("label이 주어지면 텍스트가 렌더된다", () => {
    render(<FormSelect label="과일" options={options} />);
    expect(screen.getByText("과일")).toBeInTheDocument();
  });

  it("assistiveText가 주어지면 텍스트가 렌더된다", () => {
    render(
      <FormSelect
        label="과일"
        options={options}
        assistiveText="원하는 과일을 고르세요"
      />
    );
    expect(screen.getByText("원하는 과일을 고르세요")).toBeInTheDocument();
  });

  it("errorMessage가 있을 때 destructive 텍스트로 표시되며 assistiveText는 숨겨진다", () => {
    render(
      <FormSelect
        label="과일"
        options={options}
        assistiveText="가이드"
        errorMessage="필수값입니다"
      />
    );
    expect(screen.getByText("필수값입니다")).toHaveClass("text-destructive");
    expect(screen.queryByText("가이드")).not.toBeInTheDocument();
  });

  it("disabled=true일 때 trigger가 비활성화된다", () => {
    render(<FormSelect options={options} disabled placeholder="선택" />);
    expect(screen.getByRole("combobox", { name: "선택" })).toBeDisabled();
  });

  it("기본 placeholder가 Select이다", () => {
    render(<FormSelect options={options} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Select");
  });
});
