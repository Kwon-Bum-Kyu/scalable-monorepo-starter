import { cn } from "@repo/ui";
import type React from "react";

interface DataTableProps {
  head: ReadonlyArray<string>;
  className?: string;
  children: React.ReactNode;
}

export default function DataTable({
  head,
  className,
  children,
}: DataTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className={cn("w-full text-left text-sm", className)}>
        <thead>
          <tr>
            {head.map((label) => (
              <th
                key={label}
                scope="col"
                className="whitespace-nowrap border-b border-border p-3 text-xs font-bold tracking-label text-muted-foreground"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
