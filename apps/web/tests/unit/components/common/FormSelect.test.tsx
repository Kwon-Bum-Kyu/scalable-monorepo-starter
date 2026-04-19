import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormSelect } from "@repo/ui";

const mockOptions = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

describe("FormSelect 소비처 스모크", () => {
  it("placeholder가 trigger에 표시된다", () => {
    render(
      <FormSelect
        options={mockOptions}
        placeholder="Select an option"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Select an option");
  });

  it("label이 주어지면 화면에 렌더된다", () => {
    render(
      <FormSelect label="항목" options={mockOptions} placeholder="Select" />
    );
    expect(screen.getByText("항목")).toBeInTheDocument();
  });

  it("disabled=true이면 combobox가 비활성화된다", () => {
    render(
      <FormSelect
        options={mockOptions}
        placeholder="Select an option"
        disabled
      />
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
