import * as React from "react";

import { cn } from "@repo/ui/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/pagination";

export interface SimplePaginationProps {
  current: number;
  total: number;
  onChange?: (page: number) => void;
  className?: string;
}

function SimplePagination({
  current,
  total,
  onChange,
  className,
}: SimplePaginationProps): React.JSX.Element | null {
  if (total < 1) {
    return null;
  }

  const clamp = (n: number) => Math.min(Math.max(n, 1), total);
  const handlePage = (page: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (page === current) return;
    onChange?.(clamp(page));
  };

  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const hasPrev = current > 1;
  const hasNext = current < total;

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        {hasPrev && (
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePage(current - 1)} />
          </PaginationItem>
        )}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === current}
              onClick={handlePage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {hasNext && (
          <PaginationItem>
            <PaginationNext href="#" onClick={handlePage(current + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export { SimplePagination };
