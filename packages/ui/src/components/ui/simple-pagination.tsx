import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/pagination";
import { cn } from "@repo/ui/lib/utils";
import * as React from "react";

export interface SimplePaginationProps {
  current: number;
  total: number;
  onChange?: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

type PageToken = number | "start-ellipsis" | "end-ellipsis";

function buildPages(
  current: number,
  total: number,
  siblingCount: number,
): PageToken[] {
  if (total <= 1) return [1];
  const firstPage = 1;
  const lastPage = total;
  const totalNumbers = siblingCount * 2 + 5;
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblingCount, firstPage);
  const rightSibling = Math.min(current + siblingCount, lastPage);

  const showLeftEllipsis = leftSibling > firstPage + 1;
  const showRightEllipsis = rightSibling < lastPage - 1;

  const tokens: PageToken[] = [firstPage];
  if (showLeftEllipsis) tokens.push("start-ellipsis");
  const startRange = showLeftEllipsis ? leftSibling : firstPage + 1;
  const endRange = showRightEllipsis ? rightSibling : lastPage - 1;
  for (let p = startRange; p <= endRange; p++) {
    if (p !== firstPage && p !== lastPage) tokens.push(p);
  }
  if (showRightEllipsis) tokens.push("end-ellipsis");
  tokens.push(lastPage);
  return tokens;
}

function SimplePagination({
  current,
  total,
  onChange,
  className,
  siblingCount = 1,
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

  const tokens = buildPages(current, total, siblingCount);
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
        {tokens.map((token, index) => {
          if (token === "start-ellipsis" || token === "end-ellipsis") {
            return (
              <PaginationItem key={`${token}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={token}>
              <PaginationLink
                href="#"
                isActive={token === current}
                onClick={handlePage(token)}
              >
                {token}
              </PaginationLink>
            </PaginationItem>
          );
        })}
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
