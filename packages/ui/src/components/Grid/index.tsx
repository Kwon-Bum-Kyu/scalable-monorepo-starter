import React from "react";

import { cn } from "../utils/cn";
import { GridItemProps, GridProps } from "./types";

const Grid: React.FC<GridProps> = ({ children }) => {
  return (
    <div className="tablet:grid-cols-6 tablet:px-8 desktop:grid-cols-12 desktop:px-16 grid grid-cols-4 gap-4 px-4">
      {children}
    </div>
  );
};

const GridItem: React.FC<GridItemProps> = ({ children, className = "" }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {children}
    </div>
  );
};

export { Grid, GridItem };
