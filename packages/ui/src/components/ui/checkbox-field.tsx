import * as React from "react";

import { cn } from "@repo/ui/lib/utils";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";

type CheckboxProps = React.ComponentPropsWithoutRef<typeof Checkbox>;

export interface CheckboxFieldProps extends Omit<CheckboxProps, "id"> {
  id?: string;
  label: React.ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
}

function CheckboxField({
  id,
  label,
  labelClassName,
  wrapperClassName,
  className,
  ...checkboxProps
}: CheckboxFieldProps): React.JSX.Element {
  const reactId = React.useId();
  const fieldId = id ?? `checkbox-${reactId}`;
  return (
    <div className={cn("flex items-center space-x-2", wrapperClassName)}>
      <Checkbox id={fieldId} className={className} {...checkboxProps} />
      <Label htmlFor={fieldId} className={labelClassName}>
        {label}
      </Label>
    </div>
  );
}

export { CheckboxField };
