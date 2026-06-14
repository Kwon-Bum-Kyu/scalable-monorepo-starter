import { Button, Input, Label } from "@repo/ui";
import { useEffect, useRef } from "react";

import {
  type ExampleFormState,
  STATUS_OPTIONS,
} from "./exampleFormState";

interface ExampleFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  value: ExampleFormState;
  onChange: (next: ExampleFormState) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const TITLE_BY_MODE: Record<ExampleFormDialogProps["mode"], string> = {
  create: "New Example",
  edit: "Edit Example",
};

const SUBMIT_LABEL_BY_MODE: Record<ExampleFormDialogProps["mode"], string> = {
  create: "Create",
  edit: "Save",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ExampleFormDialog = ({
  open,
  mode,
  value,
  onChange,
  onSubmit,
  onClose,
}: ExampleFormDialogProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    triggerRef.current = document.activeElement as HTMLElement | null;
    titleInputRef.current?.focus();
    return () => {
      triggerRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) {
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const isSubmitDisabled = value.title.trim().length === 0;

  return (
    <div className="bg-foreground/50 fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="example-dialog-title"
        className="bg-background text-foreground w-full max-w-md rounded-md p-6 shadow-md"
      >
        <h2
          id="example-dialog-title"
          className="text-foreground mb-4 text-lg font-semibold"
        >
          {TITLE_BY_MODE[mode]}
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="example-title">
              Title <span aria-hidden="true">*</span>
            </Label>
            <Input
              ref={titleInputRef}
              id="example-title"
              required
              aria-required="true"
              value={value.title}
              onChange={(event) =>
                onChange({ ...value, title: event.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="example-description">Description</Label>
            <textarea
              id="example-description"
              value={value.description}
              onChange={(event) =>
                onChange({ ...value, description: event.target.value })
              }
              className="border-input bg-background text-foreground focus-visible:ring-ring min-h-20 w-full rounded-md border p-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-muted-foreground text-sm">Status</legend>
            {STATUS_OPTIONS.map((status) => (
              <label
                key={status}
                className="text-foreground flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="example-status"
                  value={status}
                  checked={value.status === status}
                  onChange={() => onChange({ ...value, status })}
                />
                {status}
              </label>
            ))}
          </fieldset>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitDisabled}
            >
              {SUBMIT_LABEL_BY_MODE[mode]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleFormDialog;
