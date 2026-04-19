import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

describe("Select", () => {
  it("기본 trigger가 렌더된다", () => {
    render(
      <Select>
        <SelectTrigger aria-label="국가">
          <SelectValue placeholder="선택하세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kr">한국</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(
      screen.getByRole("combobox", { name: "국가" })
    ).toBeInTheDocument();
  });

  it("placeholder 텍스트가 노출된다", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="선택하세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kr">한국</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText("선택하세요")).toBeInTheDocument();
  });
});
