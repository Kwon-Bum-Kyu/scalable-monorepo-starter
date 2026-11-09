import PageContainer from "@/components/layouts/PageContainer";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToSection } from "@/utils/scrollToSection";
import { GuideSectionSelect, GuideSidebar } from "@/view/guide/GuideNav";
import { GUIDE_SECTION_IDS, type GuideSectionId } from "@/view/guide/navData";
import {
  ClearSpaceSection,
  ConceptSection,
  FilesSection,
  IconsSection,
  LogosSection,
  MisuseSection,
} from "@/view/guide/sections/brand";
import { ComponentsSection } from "@/view/guide/sections/components";
import { GuideHead, PrinciplesSection } from "@/view/guide/sections/intro";
import {
  BreakpointSection,
  ColorSection,
  SpacingSection,
  TypographySection,
} from "@/view/guide/sections/tokens";

const Guide = () => {
  const { activeId, setActiveId } = useActiveSection(GUIDE_SECTION_IDS);
  const handleSelect = (id: GuideSectionId) => {
    setActiveId(id);
    scrollToSection(id);
  };

  return (
    <>
      <GuideSectionSelect activeId={activeId} onSelect={handleSelect} />
      <PageContainer className="pb-16 pt-8 desktop:flex desktop:items-start desktop:gap-4 desktop:pb-24 desktop:pt-16">
        <aside className="hidden desktop:sticky desktop:top-4 desktop:block desktop:max-h-sidebar-h desktop:w-44 desktop:shrink-0 desktop:overflow-y-auto">
          <GuideSidebar activeId={activeId} onSelect={handleSelect} />
        </aside>
        <div className="min-w-0 flex-1">
          <GuideHead />
          <PrinciplesSection />
          <ColorSection />
          <TypographySection />
          <SpacingSection />
          <BreakpointSection />
          <ComponentsSection />
          <ConceptSection />
          <LogosSection />
          <ClearSpaceSection />
          <MisuseSection />
          <IconsSection />
          <FilesSection />
        </div>
      </PageContainer>
    </>
  );
};

export default Guide;
