import React from "react";
import { cn } from "../utils/cn";
import { TabsProps } from "./types";

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
}) => {
  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "rounded px-4 py-1 text-sm font-medium transition",
            variant === "pill"
              ? cn(
                  tab === activeTab
                    ? "bg-blue-500 text-system-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )
              : cn(
                  tab === activeTab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-600 hover:text-blue-500",
                ),
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
