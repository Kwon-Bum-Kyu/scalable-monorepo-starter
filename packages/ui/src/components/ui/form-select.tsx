import * as React from "react";

import { cn } from "@repo/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

export interface FormSelectOption {
  label: string;
  value: string;
}

export interface FormSelectProps {
  label?: string;
  assistiveText?: string;
  errorMessage?: string;
  options: FormSelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  /**
   * 기존 Dropdown의 `searchable`은 본 기획에서 미지원. Combobox 후속 기획에서 재도입.
   */
  searchable?: never;
}

function FormSelect({
  label,
  assistiveText,
  errorMessage,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select",
  disabled,
  className,
  id,
}: FormSelectProps): React.JSX.Element {
  const reactId = React.useId();
  const fieldId = id ?? `form-select-${reactId}`;
  const hasError = !!errorMessage;

  return (
    <div className={cn("flex w-full flex-col space-y-1", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={fieldId}
          aria-label={placeholder}
          className={cn(hasError && "border-destructive")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : assistiveText ? (
        <p className="text-xs text-muted-foreground">{assistiveText}</p>
      ) : null}
    </div>
  );
}

export { FormSelect };
