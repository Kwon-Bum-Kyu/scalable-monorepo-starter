import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { LinkProps } from "./types";

const Link: React.FC<LinkProps> = ({
  to,
  children,
  disabled = false,
  className = "",
}) => {
  const baseStyle = "font-medium transition-colors duration-150";
  const variantStyles = {
    enabled: "text-blue-500 hover:text-blue-600 active:text-blue-800",
    disabled: "text-gray-300 pointer-events-none",
  };
  const style = disabled ? variantStyles.disabled : variantStyles.enabled;

  return (
    <RouterLink to={to} className={`${baseStyle} ${style} ${className}`}>
      {children}
    </RouterLink>
  );
};

export default Link;
