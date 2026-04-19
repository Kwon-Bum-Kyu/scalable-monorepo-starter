import React, { useId } from "react";

import { cn } from "../utils/cn";
import { InputProps } from "./types";

const Input: React.FC<InputProps> = ({
  label,
  assistiveText,
  errorMessage,
  disabled,
  className,
  id: providedId,
  ...props
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const hasError = !!errorMessage;
  const descriptionId = hasError
    ? `${id}-error`
    : assistiveText
      ? `${id}-desc`
      : undefined;

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={id}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={descriptionId}
        className={cn(
          "rounded border px-3 py-2 text-sm transition-colors outline-none",
          "placeholder-gray-400",
          disabled
            ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400"
            : hasError
              ? "border-system-red focus:border-system-red"
              : "border-gray-100 hover:border-gray-400 focus:border-blue-500",
          className,
        )}
        {...props}
      />

      {/* 보조 텍스트 or 에러 메시지 */}
      {hasError ? (
        <p className="text-system-red text-xs">{errorMessage}</p>
      ) : assistiveText ? (
        <p className="text-xs text-gray-400">{assistiveText}</p>
      ) : null}
    </div>
  );
};

export default Input;
