import { useState } from "react";

import { Sidebar } from "@/view/guide/primitives";
import { BrandSection } from "@/view/guide/sections/brand";
import { ComponentsSection } from "@/view/guide/sections/components";
import { OverviewSection, PrinciplesSection } from "@/view/guide/sections/intro";
import {
  BreakpointsSection,
  ColorsSection,
  SpacingSection,
  TypographySection,
} from "@/view/guide/sections/tokens";

const Guide = () => {
  const [sliderValue, setSliderValue] = useState<number[]>([50]);
  const [rangeValue, setRangeValue] = useState<number[]>([20, 80]);
  const [activeTab, setActiveTab] = useState("Tab 1");

  return (
    <div className="flex w-full gap-8 py-10">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <OverviewSection />
        <PrinciplesSection />
        <ColorsSection />
        <TypographySection />
        <SpacingSection />
        <BreakpointsSection />
        <ComponentsSection
          sliderValue={sliderValue}
          onSliderChange={setSliderValue}
          rangeValue={rangeValue}
          onRangeChange={setRangeValue}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
        />
        <BrandSection />
      </div>
    </div>
  );
};

export default Guide;
