import React from "react";
import { cn } from "../utils/cn";
import { ButtonProps } from "./types.ts";

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-semibold focus:outline-none transition-colors duration-150";

  const variantStyles = {
    primary: disabled
      ? "bg-blue-100 text-system-white cursor-not-allowed"
      : "bg-blue-500 text-system-white hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-800",
    secondary: disabled
      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
      : "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-300",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
