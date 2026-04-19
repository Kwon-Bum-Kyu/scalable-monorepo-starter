import React from "react";

import { cn } from "../utils/cn";
import { SliderProps } from "./types";

const Slider: React.FC<SliderProps> = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled = false,
  showValue = true,
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex items-center space-x-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "h-2 w-full appearance-none rounded bg-gray-200 outline-none transition-all",
            "focus:ring-2 focus:ring-blue-500",
            disabled
              ? "cursor-not-allowed bg-gray-100"
              : "hover:bg-gray-300 active:bg-blue-600 [&::-webkit-slider-thumb]:hover:bg-blue-600",
            "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500",
            "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500",
          )}
        />

        {showValue && (
          <span
            className={cn(
              "text-sm",
              disabled ? "text-gray-400" : "text-gray-700",
            )}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export default Slider;
