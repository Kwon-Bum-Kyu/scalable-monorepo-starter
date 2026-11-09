import { Badge } from "@repo/ui";
import type React from "react";

import {
  NEXT_PILLAR,
  ROOT_BEAM,
  ROOT_KEYS,
  ROOT_PILLARS,
} from "@/view/home/homeData";
import { HomeSection, SectionHead } from "@/view/home/primitives";

export function StructureSection(): React.JSX.Element {
  return (
    <HomeSection id="structure" tinted>
      <SectionHead
        id="structure"
        eyebrow="구조"
        title="공유 루트"
        lead="저장소 루트 하나와 공유 패키지가 모든 앱을 같은 규칙으로 받칩니다."
      />
      <figure aria-label="모노레포 구조도. 보는 packages, 기둥은 apps, 보에서 떨어진 기둥은 다음 앱입니다.">
        <div className="flex flex-col items-start gap-4 rounded-t-lg bg-foreground p-4 text-background tablet:flex-row tablet:flex-wrap tablet:items-center tablet:justify-between tablet:gap-x-6 tablet:px-6 tablet:py-5">
          <div>
            <p className="font-mono text-base font-semibold">{ROOT_BEAM.name}</p>
            <p className="text-sm text-gray-100">{ROOT_BEAM.description}</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {ROOT_BEAM.packages.map((name) => (
              <li key={name}>
                <Badge className="font-mono font-medium">{name}</Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-2 desktop:grid-cols-5 desktop:items-start desktop:gap-x-4 desktop:gap-y-0">
          {ROOT_PILLARS.map((pillar) => (
            <div
              key={pillar.name}
              className="flex min-h-32 flex-col items-start gap-3 bg-foreground p-4 text-background desktop:min-h-48 desktop:p-5"
            >
              <p className="font-mono text-base font-semibold">{pillar.name}</p>
              <Badge className="font-mono font-medium">{pillar.port}</Badge>
              <p className="text-sm text-gray-100">{pillar.description}</p>
            </div>
          ))}
          <div className="col-span-2 mt-2 flex flex-col items-start gap-3 bg-primary p-4 text-primary-foreground desktop:col-span-1 desktop:mt-4 desktop:min-h-44 desktop:p-5">
            <p className="font-sans text-base font-semibold">{NEXT_PILLAR.name}</p>
            <p className="text-sm text-blue-50">{NEXT_PILLAR.description}</p>
            <Badge className="font-mono font-medium">{NEXT_PILLAR.badge}</Badge>
          </div>
        </div>
      </figure>
      <dl className="mt-8 grid grid-cols-1 gap-4 tablet:mt-10 tablet:grid-cols-3 tablet:gap-8">
        {ROOT_KEYS.map((key) => (
          <div key={key.term} className="grid gap-1">
            <dt className="font-bold">{key.term}</dt>
            <dd className="text-sm text-muted-foreground">{key.description}</dd>
          </div>
        ))}
      </dl>
    </HomeSection>
  );
}
