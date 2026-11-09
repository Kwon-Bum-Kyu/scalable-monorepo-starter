import type { ExampleStatus } from "@repo/shared-types";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@repo/ui";
import { type RefObject, useState } from "react";

import { type ExampleFormState, STATUS_OPTIONS } from "./exampleFormState";
import { PAGE_ACTION_CLASS } from "./examplesView";

type Mode = "create" | "edit";

interface ExampleFormDialogProps {
  open: boolean;
  mode: Mode;
  value: ExampleFormState;
  disabled?: boolean;
  loading?: boolean;
  onChange: (next: ExampleFormState) => void;
  onSubmit: () => void;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

const TITLE_BY_MODE: Record<Mode, string> = {
  create: "New Example",
  edit: "Edit Example",
};

const SUBMIT_LABEL_BY_MODE: Record<Mode, string> = {
  create: "Create",
  edit: "Save",
};

type FormBodyProps = Pick<
  ExampleFormDialogProps,
  | "mode"
  | "value"
  | "disabled"
  | "loading"
  | "onChange"
  | "onSubmit"
  | "onClose"
>;

// DialogContent가 닫히면 언마운트되므로 titleTouched는 열릴 때마다 false로 시작한다.
const ExampleFormBody = ({
  mode,
  value,
  disabled = false,
  loading = false,
  onChange,
  onSubmit,
  onClose,
}: FormBodyProps) => {
  const [titleTouched, setTitleTouched] = useState(false);
  const isTitleEmpty = value.title.trim().length === 0;
  const titleInvalid = titleTouched && isTitleEmpty;

  return (
    <>
      <DialogHeader className="pr-12">
        <DialogTitle>{TITLE_BY_MODE[mode]}</DialogTitle>
      </DialogHeader>
      <form
        id="example-form"
        noValidate
        aria-busy={loading}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isTitleEmpty) {
            onSubmit();
          }
        }}
        className="grid gap-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="example-title">
            Title <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="example-title"
            className="tablet:h-10 h-11"
            placeholder="예제 제목"
            aria-required="true"
            aria-invalid={titleInvalid}
            aria-describedby="example-title-help"
            disabled={disabled}
            value={value.title}
            onChange={(event) =>
              onChange({ ...value, title: event.target.value })
            }
            onBlur={() => setTitleTouched(true)}
          />
          <p
            id="example-title-help"
            className={cn(
              "text-sm",
              titleInvalid ? "text-destructive" : "text-muted-foreground",
            )}
          >
            Title을 입력해야 저장할 수 있습니다.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="example-description">Description</Label>
          <textarea
            id="example-description"
            rows={3}
            disabled={disabled}
            value={value.description}
            onChange={(event) =>
              onChange({ ...value, description: event.target.value })
            }
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring tablet:text-sm flex min-h-20 w-full rounded-lg border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold">Status</legend>
          <RadioGroup
            disabled={disabled}
            value={value.status}
            onValueChange={(status) =>
              onChange({ ...value, status: status as ExampleStatus })
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <label
                key={status}
                className="flex min-h-11 items-center gap-2 text-sm"
              >
                <RadioGroupItem value={status} />
                {status}
              </label>
            ))}
          </RadioGroup>
        </fieldset>
      </form>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={PAGE_ACTION_CLASS}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="example-form"
          size="lg"
          className={PAGE_ACTION_CLASS}
          disabled={disabled || isTitleEmpty}
        >
          {SUBMIT_LABEL_BY_MODE[mode]}
        </Button>
      </DialogFooter>
    </>
  );
};

const ExampleFormDialog = ({
  open,
  returnFocusRef,
  onClose,
  ...body
}: ExampleFormDialogProps) => (
  <Dialog
    open={open}
    onOpenChange={(next) => {
      if (!next) {
        onClose();
      }
    }}
  >
    <DialogContent
      aria-describedby={undefined}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        returnFocusRef.current?.focus();
      }}
    >
      <ExampleFormBody {...body} onClose={onClose} />
    </DialogContent>
  </Dialog>
);

export default ExampleFormDialog;
