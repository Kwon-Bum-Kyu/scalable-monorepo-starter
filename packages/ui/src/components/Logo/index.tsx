import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/">
      <img
        src="/logo.png"
        alt="Logo"
        className="h-logo-h w-container-logo order-1 flex-none grow-0"
      />
    </Link>
  );
};

export default Logo;
