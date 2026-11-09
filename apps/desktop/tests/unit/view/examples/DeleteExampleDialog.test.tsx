import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import DeleteExampleDialog from "@/view/examples/DeleteExampleDialog";

const renderDialog = (
  props: Partial<React.ComponentProps<typeof DeleteExampleDialog>> = {},
) => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  render(
    <DeleteExampleDialog
      target={{ id: "id-1", title: "첫 예제" }}
      onConfirm={onConfirm}
      onCancel={onCancel}
      returnFocusRef={createRef<HTMLElement>()}
      {...props}
    />,
  );
  return { onConfirm, onCancel };
};

describe("DeleteExampleDialog", () => {
  it("target이 있을 때 alertdialog로 제목과 본문을 보여 준다", () => {
    renderDialog();

    const dialog = screen.getByRole("alertdialog", {
      name: "예제를 삭제합니다.",
    });
    expect(dialog).toHaveTextContent(
      "'첫 예제'를 삭제하면 되돌릴 수 없습니다.",
    );
  });

  it("target이 null일 때 닫혀 있다", () => {
    renderDialog({ target: null });

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("열리면 첫 포커스가 Cancel에 놓인다", () => {
    renderDialog();

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("Cancel을 클릭하면 onCancel만 호출된다", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("Delete를 클릭하면 대상 id로 onConfirm이 호출된다", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onConfirm).toHaveBeenCalledWith("id-1");
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("Delete 버튼이 destructive 스타일이다", () => {
    renderDialog();

    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
      "bg-destructive",
    );
  });

  it("Esc를 누르면 onCancel이 호출된다", async () => {
    const user = userEvent.setup();
    const { onCancel } = renderDialog();

    await user.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalled();
  });
});
