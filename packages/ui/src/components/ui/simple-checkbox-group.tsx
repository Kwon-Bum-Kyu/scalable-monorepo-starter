import { CheckboxField } from "@repo/ui/components/checkbox-field";
import { cn } from "@repo/ui/lib/utils";
import * as React from "react";

export interface SimpleCheckboxOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SimpleCheckboxGroupProps {
  options: SimpleCheckboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  disabled?: boolean;
}

function SimpleCheckboxGroup({
  options,
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
  className,
  disabled,
}: SimpleCheckboxGroupProps): React.JSX.Element {
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;

  const toggle = (optValue: string, checked: boolean) => {
    const next = checked
      ? [...selected, optValue]
      : selected.filter((v) => v !== optValue);
    if (!isControlled) {
      setInternal(next);
    }
    onChange?.(next);
  };

  return (
    <div
      role="group"
      className={cn(
        orientation === "horizontal" ? "flex flex-row gap-4" : "grid gap-2",
        className
      )}
    >
      {options.map((opt) => (
        <CheckboxField
          key={opt.value}
          label={opt.label}
          checked={selected.includes(opt.value)}
          disabled={opt.disabled ?? disabled}
          onCheckedChange={(checked) => toggle(opt.value, checked === true)}
        />
      ))}
    </div>
  );
}

export { SimpleCheckboxGroup };
