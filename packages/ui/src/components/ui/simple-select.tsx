import * as React from "react";

import { cn } from "@repo/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

export interface SimpleSelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SimpleSelectProps {
  options: SimpleSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function SimpleSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select",
  disabled,
  className,
}: SimpleSelectProps): React.JSX.Element {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { SimpleSelect };
