import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui";
import { type RefObject, useRef } from "react";

import { PAGE_ACTION_CLASS } from "./examplesView";

export interface DeleteExampleTarget {
  id: string;
  title: string;
}

export interface DeleteExampleDialogProps {
  target: DeleteExampleTarget | null;
  onConfirm: (id: string) => void;
  onCancel: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

export default function DeleteExampleDialog({
  target,
  onConfirm,
  onCancel,
  returnFocusRef,
}: DeleteExampleDialogProps): React.JSX.Element {
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog
      open={target !== null}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent
        role="alertdialog"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          cancelRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <DialogHeader className="pr-12">
          <DialogTitle>예제를 삭제합니다.</DialogTitle>
          <DialogDescription>
            {target ? `'${target.title}'를 삭제하면 되돌릴 수 없습니다.` : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            ref={cancelRef}
            type="button"
            variant="outline"
            className={PAGE_ACTION_CLASS}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className={PAGE_ACTION_CLASS}
            onClick={() => target && onConfirm(target.id)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
