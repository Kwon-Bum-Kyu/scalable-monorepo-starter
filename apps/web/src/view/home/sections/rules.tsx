import { Card } from "@repo/ui";
import type React from "react";

import InlineCode from "@/components/InlineCode";
import { GUARDS, RULES } from "@/view/home/homeData";
import { HomeSection, SectionHead } from "@/view/home/primitives";

export function RulesSection(): React.JSX.Element {
  return (
    <HomeSection id="rules" tinted>
      <SectionHead
        id="rules"
        eyebrow="규칙과 가드"
        title="바꾸지 않는 규칙 아홉 가지."
        lead="모든 워크스페이스에 같은 규칙을 적용하고 AI 가드 세 개가 규칙 위반을 검사합니다."
      />
      <div className="grid grid-cols-1 gap-y-12 desktop:grid-cols-12 desktop:items-start desktop:gap-x-4">
        <ol className="grid grid-cols-1 gap-6 tablet:grid-cols-2 tablet:gap-x-6 tablet:gap-y-8 desktop:col-span-8">
          {RULES.map((rule) => (
            <li key={rule.number} className="grid gap-1 border-t-2 border-foreground pt-4">
              <p className="font-display text-sm font-bold tracking-label">{rule.number}</p>
              <h3 className="text-lg font-semibold tablet:text-xl">
                <InlineCode text={rule.title} />
              </h3>
              <p className="text-sm text-muted-foreground">
                <InlineCode text={rule.description} />
              </p>
            </li>
          ))}
        </ol>
        <aside aria-label="AI 가드" className="grid gap-3 desktop:col-span-4">
          <p className="text-xs font-bold tracking-eyebrow text-muted-foreground">
            규칙을 검사하는 AI 가드
          </p>
          {GUARDS.map((guard) => (
            <Card key={guard.name} variant="flat" className="grid gap-1 p-5">
              <p className="font-mono text-base font-semibold">{guard.name}</p>
              <p className="text-sm text-muted-foreground">
                <InlineCode text={guard.description} />
              </p>
            </Card>
          ))}
        </aside>
      </div>
    </HomeSection>
  );
}
