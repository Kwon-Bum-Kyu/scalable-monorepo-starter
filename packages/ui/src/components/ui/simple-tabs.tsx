import * as React from "react";

import { cn } from "@repo/ui/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

export interface SimpleTabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface SimpleTabsProps {
  items: SimpleTabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  listClassName?: string;
}

function SimpleTabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  listClassName,
}: SimpleTabsProps): React.JSX.Element {
  return (
    <Tabs
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={cn(className)}
    >
      <TabsList className={cn(listClassName)}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export { SimpleTabs };
