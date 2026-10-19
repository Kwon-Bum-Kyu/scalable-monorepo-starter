import { SystemIcon } from "@repo/ui";

import { Section, TokenCard } from "@/view/guide/primitives";

export const BrandSection = () => (
  <Section
    id="brand"
    eyebrow="Brand"
    title="로고 · 아이콘"
    description="System icons (Lucide 기반) — 16/20/24px 사이즈."
  >
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TokenCard title="System icons" hint="--system-icon · 16/20/24px">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <SystemIcon name="eye" size={20} />
            <span className="font-mono text-xs text-gray-400">eye</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SystemIcon name="close" className="text-system-red" size={20} />
            <span className="font-mono text-xs text-gray-400">close</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SystemIcon name="check-circle-outline" size={24} />
            <span className="font-mono text-xs text-gray-400">
              check-circle
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SystemIcon name="info" size={20} />
            <span className="font-mono text-xs text-gray-400">info</span>
          </div>
        </div>
      </TokenCard>

      <TokenCard title="Brand · Logo" hint="<Logo />">
        <p className="text-sm leading-6 text-gray-700">
          Logo 컴포넌트는 RootLayout 헤더에 사용됩니다. 사이즈는 --container-logo
          (160px) · --spacing-logo-h (40px) 토큰으로 제어합니다.
        </p>
      </TokenCard>
    </div>
  </Section>
);
