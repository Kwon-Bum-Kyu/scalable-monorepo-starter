import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  type HomeScrollState,
  scrollToSection,
} from "@/utils/scrollToSection";
import { DesignSystemEntrySection } from "@/view/home/sections/entry";
import { HeroSection } from "@/view/home/sections/hero";
import { QuickstartSection } from "@/view/home/sections/quickstart";
import { RulesSection } from "@/view/home/sections/rules";
import { StructureSection } from "@/view/home/sections/structure";

export default function Home(): React.JSX.Element {
  const { state } = useLocation();

  useEffect(() => {
    const scrollState = state as HomeScrollState | null;
    if (scrollState?.scrollTo) scrollToSection(scrollState.scrollTo);
  }, [state]);

  return (
    <>
      <HeroSection />
      <StructureSection />
      <QuickstartSection />
      <RulesSection />
      <DesignSystemEntrySection />
    </>
  );
}
