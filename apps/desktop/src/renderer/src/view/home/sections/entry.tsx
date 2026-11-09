import { Badge, Button } from "@repo/ui";
import type React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/routes/paths";
import { DS_ENTRY_TAGS } from "@/view/home/homeData";
import { HomeSection, SectionHead } from "@/view/home/primitives";

export function DesignSystemEntrySection(): React.JSX.Element {
  return (
    <HomeSection id="design-system">
      <div className="grid max-w-188 justify-items-stretch gap-6 tablet:justify-items-start">
        <SectionHead
          id="design-system"
          eyebrow="디자인 시스템"
          title="토큰과 컴포넌트, 브랜드 규칙은 가이드에서 확인합니다."
          lead="현행 `@theme` 토큰과 `@repo/ui` 컴포넌트를 실제 견본으로 보여 줍니다."
          className="mb-0 tablet:mb-0"
        />
        <ul aria-label="가이드 대표 항목" className="flex flex-wrap gap-2">
          {DS_ENTRY_TAGS.map((tag) => (
            <li key={tag}>
              <Badge variant="secondary">{tag}</Badge>
            </li>
          ))}
        </ul>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="tablet:h-10 tablet:px-4 tablet:text-sm"
        >
          <Link to={ROUTES.guide}>디자인 시스템 가이드 보기</Link>
        </Button>
      </div>
    </HomeSection>
  );
}
