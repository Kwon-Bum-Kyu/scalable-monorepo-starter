import { Label } from "@repo/ui/components/label";
import { RadioGroupItem } from "@repo/ui/components/radio-group";
import { cn } from "@repo/ui/lib/utils";
import * as React from "react";

export interface RadioProps {
  value: string;
  label: React.ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
}

function Radio({
  value,
  label,
  id,
  disabled,
  className,
}: RadioProps): React.JSX.Element {
  const itemId = id ?? `radio-${value}`;
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <RadioGroupItem value={value} id={itemId} disabled={disabled} />
      <Label htmlFor={itemId}>{label}</Label>
    </div>
  );
}

export { Radio };
