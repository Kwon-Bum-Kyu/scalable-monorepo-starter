"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@repo/ui/lib/utils";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { tabsListVariants, tabsTriggerVariants } from "./tabs-variants";

const Tabs = TabsPrimitive.Root;

type TabsListVariant = NonNullable<
  VariantProps<typeof tabsListVariants>["variant"]
>;

const TabsListContext = React.createContext<TabsListVariant>("boxed");

interface TabsListProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => {
  const resolved = (variant ?? "boxed") as TabsListVariant;
  return (
    <TabsListContext.Provider value={resolved}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListVariants({ variant: resolved }), className)}
        {...props}
      />
    </TabsListContext.Provider>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => {
  const ctx = React.useContext(TabsListContext);
  const resolved = (variant ?? ctx) as NonNullable<
    VariantProps<typeof tabsTriggerVariants>["variant"]
  >;
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant: resolved }), className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
