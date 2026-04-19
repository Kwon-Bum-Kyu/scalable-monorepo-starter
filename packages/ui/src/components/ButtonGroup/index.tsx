import React from "react";

import { ButtonGroupProps } from "./types";

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  buttons,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex divide-x divide-gray-200 overflow-hidden rounded-md border border-gray-200 ${className}`}
    >
      {buttons.map((btn, idx) => {
        const isIcon = typeof btn.label !== "string";

        return (
          <button
            key={idx}
            onClick={btn.disabled ? undefined : btn.onClick}
            disabled={btn.disabled}
            className={`${
              isIcon
                ? "flex h-10 w-10 items-center justify-center p-2"
                : "px-4 py-2 text-sm"
            } font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300`}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
