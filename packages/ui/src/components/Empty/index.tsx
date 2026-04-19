import { Image as ImageIcon, Type, X } from "lucide-react";
import React from "react";

import { cn } from "../utils/cn";
import { EmptyProps,EmptyType } from "./types";

const iconMap: Record<EmptyType, React.ReactElement> = {
  blank: <X className="text-2xl text-gray-400" />,
  image: <ImageIcon className="text-2xl text-gray-400" />,
  text: <Type className="text-2xl text-gray-400" />,
};

const Empty: React.FC<EmptyProps> = ({
  type = "blank",
  size = 64,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center border border-gray-300 bg-gray-100",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {iconMap[type]}
    </div>
  );
};

export default Empty;
