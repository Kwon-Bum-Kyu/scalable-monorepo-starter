import { Radio } from "@repo/ui/components/radio";
import { RadioGroup } from "@repo/ui/components/radio-group";
import { cn } from "@repo/ui/lib/utils";
import * as React from "react";

export interface SimpleRadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SimpleRadioProps {
  options: SimpleRadioOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  name?: string;
  disabled?: boolean;
}

function SimpleRadio({
  options,
  defaultValue,
  value,
  onValueChange,
  orientation = "vertical",
  className,
  name,
  disabled,
}: SimpleRadioProps): React.JSX.Element {
  return (
    <RadioGroup
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      className={cn(
        orientation === "horizontal" ? "flex flex-row gap-4" : "grid gap-2",
        className,
      )}
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          value={opt.value}
          label={opt.label}
          disabled={opt.disabled ?? disabled}
        />
      ))}
    </RadioGroup>
  );
}

export { SimpleRadio };
