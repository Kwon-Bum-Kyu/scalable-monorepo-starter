import React, { useState } from "react";

import { cn } from "../utils/cn";
import { DropdownProps } from "./types";

const Dropdown: React.FC<DropdownProps> = ({
  label,
  assistiveText,
  errorMessage,
  options,
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
  searchable = false,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const hasError = !!errorMessage;
  const displayOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative flex w-full flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded border px-3 py-2 text-sm",
            disabled
              ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400"
              : hasError
                ? "border-system-red"
                : "border-gray-200 hover:border-gray-400 focus:border-blue-500",
            "transition-colors",
          )}
        >
          {selectedLabel || placeholder}
          <span className="ml-2 text-xs">▼</span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded border border-gray-200 bg-white shadow-md">
            {searchable && (
              <input
                type="text"
                autoFocus
                className="w-full border-b border-gray-200 px-3 py-2 text-sm outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
            {displayOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-400">No results</div>
            )}
            {displayOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-gray-100",
                  option.value === value && "bg-gray-100 font-semibold",
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasError ? (
        <p className="text-xs text-system-red">{errorMessage}</p>
      ) : assistiveText ? (
        <p className="text-xs text-gray-400">{assistiveText}</p>
      ) : null}
    </div>
  );
};

export default Dropdown;
