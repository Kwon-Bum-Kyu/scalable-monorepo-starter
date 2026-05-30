import { Card, CardContent } from "@repo/ui";

import { PRINCIPLES } from "@/view/guide/nav-data";
import { Section } from "@/view/guide/primitives";

export const OverviewSection = () => (
  <Section
    id="overview"
    eyebrow="KBK · Design System"
    title="디자인 시스템 한눈에 보기"
    description="Claude Design 명세와 packages/ui (shadcn/ui 기반) 의 토큰을 단일 소스로 통합합니다. 모든 색·타입·스페이싱·컴포넌트는 packages/ui/src/styles/globals.css 의 @theme 토큰에서 직접 가져옵니다."
    headingLevel={1}
  >
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        Source · <code className="font-mono text-xs">packages/ui</code>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
        Tokens · <code className="font-mono text-xs">globals.css</code>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
        Stack ·{" "}
        <code className="font-mono text-xs">
          React 19 · Vite 7 · Tailwind v4
        </code>
      </span>
    </div>
  </Section>
);

export const PrinciplesSection = () => (
  <Section
    id="principles"
    eyebrow="Principles"
    title="5가지 원칙"
    description="디자인 결정과 컴포넌트 작성 시 항상 따르는 기준입니다."
  >
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PRINCIPLES.map((p, idx) => (
        <Card key={p.title} className="shadow-2-default">
          <CardContent className="pt-6">
            <div className="font-mono text-xs text-gray-400">0{idx + 1}</div>
            <div className="mt-1 font-semibold text-gray-900">{p.title}</div>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              {p.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </Section>
);
