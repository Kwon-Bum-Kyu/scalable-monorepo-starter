import { Card } from "@repo/ui";

import InlineCode from "@/components/InlineCode";
import { PRINCIPLES } from "@/view/guide/navData";
import { GuideSection } from "@/view/guide/primitives";

export const GuideHead = () => (
  <div className="grid gap-2 pb-8 desktop:pb-12">
    <p className="text-xs font-bold tracking-eyebrow text-muted-foreground">디자인 시스템</p>
    <h1 className="text-2xl font-bold tablet:text-4xl">디자인 시스템 가이드</h1>
    <p className="mt-2 text-base text-muted-foreground tablet:text-lg">
      <InlineCode text="현행 `@theme` 토큰과 `@repo/ui` 컴포넌트, 브랜드 규칙을 한곳에서 확인합니다." />
    </p>
  </div>
);

export const PrinciplesSection = () => (
  <GuideSection id="principles" eyebrow="시작" title="원칙">
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
      {PRINCIPLES.map((principle) => (
        <Card key={principle.title} variant="flat" className="grid gap-2 p-5">
          <h3 className="text-lg font-semibold">{principle.title}</h3>
          <p className="text-sm text-muted-foreground">
            <InlineCode text={principle.description} />
          </p>
        </Card>
      ))}
    </div>
  </GuideSection>
);
