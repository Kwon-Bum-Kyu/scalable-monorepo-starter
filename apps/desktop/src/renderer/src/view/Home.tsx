import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const { pathname, state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const scrollState = state as HomeScrollState | null;
    if (!scrollState?.scrollTo) return;
    scrollToSection(scrollState.scrollTo);
    void navigate(pathname, { replace: true, state: null });
  }, [navigate, pathname, state]);

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
