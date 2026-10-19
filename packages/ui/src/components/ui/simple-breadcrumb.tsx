import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { cn } from "@repo/ui/lib/utils";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

export interface SimpleBreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface SimpleBreadcrumbProps {
  items: SimpleBreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

function SimpleBreadcrumb({
  items,
  className,
  separator,
}: SimpleBreadcrumbProps): React.JSX.Element {
  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const key = `${String(item.label)}-${index}`;
          return (
            <React.Fragment key={key}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <RouterLink to={item.href}>{item.label}</RouterLink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export { SimpleBreadcrumb };
