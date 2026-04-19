import React from "react";

import { cn } from "../utils/cn";
import { PaginationProps } from "./types";

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  onChange,
}) => {
  const pages = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="px-2 py-1 text-gray-600 hover:text-blue-700 disabled:opacity-50"
      >
        &lt;
      </button>
      {pages.map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={idx}
            onClick={() => onChange(page)}
            className={cn(
              "h-8 w-8 rounded px-2 py-1 text-center",
              page === current
                ? "bg-blue-800 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-2 text-gray-400">
            ...
          </span>
        ),
      )}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="px-2 py-1 text-gray-600 hover:text-blue-700 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
