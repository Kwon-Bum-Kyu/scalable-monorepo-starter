import { fireEvent,render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Dropdown from "../../../src/components/Dropdown";

const mockOptions = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

describe("Dropdown 컴포넌트", () => {
  it("플레이스홀더와 함께 렌더링되어야 한다.", () => {
    render(
      <Dropdown
        options={mockOptions}
        placeholder="Select an option"
        onChange={() => {}}
      />
    );
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("드롭다운을 열고 닫을 수 있어야 한다.", () => {
    render(
      <Dropdown
        options={mockOptions}
        placeholder="Select an option"
        onChange={() => {}}
      />
    );
    const dropdownButton = screen.getByText("Select an option");
    fireEvent.click(dropdownButton);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("옵션을 선택할 수 있어야 한다.", () => {
    const handleChange = vi.fn();
    render(
      <Dropdown
        options={mockOptions}
        placeholder="Select an option"
        onChange={handleChange}
      />
    );
    fireEvent.click(screen.getByText("Select an option"));
    fireEvent.click(screen.getByText("Option 1"));
    expect(handleChange).toHaveBeenCalledWith("1");
  });

  it("label과 assistiveText를 함께 표시한다.", () => {
    render(
      <Dropdown
        label="카테고리"
        assistiveText="원하는 값을 고르세요"
        options={mockOptions}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("카테고리")).toBeInTheDocument();
    expect(screen.getByText("원하는 값을 고르세요")).toBeInTheDocument();
  });

  it("errorMessage가 있으면 에러 문구가 보이고 assistiveText는 숨겨진다.", () => {
    render(
      <Dropdown
        assistiveText="assist"
        errorMessage="필수 선택 항목입니다"
        options={mockOptions}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("필수 선택 항목입니다")).toBeInTheDocument();
    expect(screen.queryByText("assist")).not.toBeInTheDocument();
  });

  it("disabled 상태일 때 클릭해도 목록이 열리지 않는다.", () => {
    render(
      <Dropdown
        options={mockOptions}
        placeholder="Select"
        disabled
        onChange={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Select"));
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("searchable이면 검색어로 옵션을 필터링한다.", () => {
    render(
      <Dropdown
        options={mockOptions}
        placeholder="Select"
        searchable
        onChange={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Select"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2" } });
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("searchable이고 결과가 없으면 'No results'를 노출한다.", () => {
    render(
      <Dropdown
        options={mockOptions}
        placeholder="Select"
        searchable
        onChange={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Select"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("value가 있으면 선택된 옵션의 label이 표시된다.", () => {
    render(
      <Dropdown
        options={mockOptions}
        placeholder="Select"
        value="2"
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });
});
