import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SimpleSelect } from "@repo/ui/components/simple-select";

const options = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
];

describe("SimpleSelect", () => {
  it("placeholder가 주어지면 trigger에 표시된다", () => {
    render(<SimpleSelect options={options} placeholder="언어 선택" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("언어 선택");
  });

  it("defaultValue가 주어지면 해당 label이 trigger에 표시된다", () => {
    render(<SimpleSelect options={options} defaultValue="ko" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("한국어");
  });

  it("disabled=true일 때 trigger가 비활성화된다", () => {
    render(<SimpleSelect options={options} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
