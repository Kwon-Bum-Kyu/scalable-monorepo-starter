import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ExampleFormDialog from "@/view/examples/ExampleFormDialog";
import { EMPTY_EXAMPLE_FORM } from "@/view/examples/exampleFormState";

describe("ExampleFormDialog", () => {
  it("[상태: open=false] 다이얼로그가 렌더되지 않는다", () => {
    render(
      <ExampleFormDialog
        open={false}
        mode="create"
        value={EMPTY_EXAMPLE_FORM}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("[모드: edit] 헤더가 'Edit Example' 이고 제출 버튼은 'Save'이다", () => {
    render(
      <ExampleFormDialog
        open={true}
        mode="edit"
        value={{ ...EMPTY_EXAMPLE_FORM, title: "기존" }}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Edit Example")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^save$/i })).toBeEnabled();
  });

  it("Cancel 버튼 클릭 시 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ExampleFormDialog
        open={true}
        mode="create"
        value={{ ...EMPTY_EXAMPLE_FORM, title: "x" }}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("title 입력 시 onChange가 새 객체로 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExampleFormDialog
        open={true}
        mode="create"
        value={EMPTY_EXAMPLE_FORM}
        onChange={onChange}
        onSubmit={() => {}}
        onClose={() => {}}
      />,
    );

    const input = screen.getByLabelText(/Title/);
    await user.type(input, "a");

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toMatchObject({ title: "a" });
  });
});
