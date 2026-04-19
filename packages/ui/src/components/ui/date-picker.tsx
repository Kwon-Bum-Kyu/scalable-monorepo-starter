import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

export interface DatePickerProps {
  value?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
}

function DatePicker({
  value,
  onSelect,
  placeholder = "날짜 선택",
  disabled,
  className,
  dateFormat = "yyyy-MM-dd",
}: DatePickerProps): React.JSX.Element {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-60 justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, dateFormat) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
