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

  it("title이 공백뿐일 때 제출 버튼을 클릭할 수 없다", () => {
    render(
      <ExampleFormDialog
        open={true}
        mode="create"
        value={{ ...EMPTY_EXAMPLE_FORM, title: "   " }}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
  });

  it("status 라디오를 선택하면 onChange가 해당 status로 호출된다", async () => {
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

    const radios = screen.getAllByRole("radio");
    await user.click(radios[radios.length - 1]);

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toHaveProperty("status");
  });

  it("description 입력 시 onChange가 새 description으로 호출된다", async () => {
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

    await user.type(screen.getByLabelText("Description"), "d");

    expect(onChange.mock.calls[0][0]).toMatchObject({ description: "d" });
  });

  it("Escape 키를 누르면 onClose가 호출된다", async () => {
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

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("열리면 title 입력에 포커스가 이동한다", () => {
    render(
      <ExampleFormDialog
        open={true}
        mode="create"
        value={EMPTY_EXAMPLE_FORM}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />,
    );

    expect(screen.getByLabelText(/Title/)).toHaveFocus();
  });

  it("마지막 요소에서 Tab을 누르면 첫 요소로 포커스가 순환한다", async () => {
    const user = userEvent.setup();
    render(
      <ExampleFormDialog
        open={true}
        mode="create"
        value={{ ...EMPTY_EXAMPLE_FORM, title: "x" }}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />,
    );

    screen.getByRole("button", { name: /create/i }).focus();
    await user.tab();

    expect(screen.getByLabelText(/Title/)).toHaveFocus();
  });

  it("첫 요소에서 Shift+Tab을 누르면 마지막 요소로 포커스가 순환한다", async () => {
    const user = userEvent.setup();
    render(
      <ExampleFormDialog
        open={true}
        mode="create"
        value={{ ...EMPTY_EXAMPLE_FORM, title: "x" }}
        onChange={() => {}}
        onSubmit={() => {}}
        onClose={() => {}}
      />,
    );

    screen.getByLabelText(/Title/).focus();
    await user.tab({ shift: true });

    expect(screen.getByRole("button", { name: /create/i })).toHaveFocus();
  });
});
