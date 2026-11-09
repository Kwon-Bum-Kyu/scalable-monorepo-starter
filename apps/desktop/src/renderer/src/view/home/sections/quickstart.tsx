import { Card } from "@repo/ui";
import type React from "react";

import InlineCode from "@/components/InlineCode";
import CodeBlock from "@/view/home/CodeBlock";
import { QUICKSTART_STEPS } from "@/view/home/homeData";
import { HomeSection, SectionHead } from "@/view/home/primitives";

const HELP = "text-sm text-muted-foreground";

export function QuickstartSection(): React.JSX.Element {
  return (
    <HomeSection id="quickstart">
      <SectionHead
        id="quickstart"
        eyebrow="시작하기 · Quickstart"
        title="네 단계로 로컬 개발 환경을 띄웁니다."
      />
      <ol className="grid grid-cols-1 gap-4 desktop:grid-cols-2">
        {QUICKSTART_STEPS.map((step) => (
          <li key={step.number}>
            <Card variant="flat" className="flex h-full flex-col gap-4 p-5 tablet:p-6">
              <div className="grid gap-1">
                <p className="font-display text-sm font-bold tracking-label text-muted-foreground">
                  {step.number}
                </p>
                <h3 className="text-lg font-semibold tablet:text-xl">{step.title}</h3>
              </div>
              {"blocks" in step ? (
                step.blocks.map((block) => (
                  <div key={block.help} className="grid gap-2">
                    {block.subtitle ? (
                      <p className="text-sm font-semibold">{block.subtitle}</p>
                    ) : null}
                    <CodeBlock segments={block.code} />
                    <p className={HELP}>
                      <InlineCode text={block.help} />
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <table className="table w-full text-left text-sm">
                      <thead>
                        <tr>
                          <th scope="col" className="whitespace-nowrap border-b border-border p-3 text-xs font-bold tracking-label text-muted-foreground">
                            서비스
                          </th>
                          <th scope="col" className="whitespace-nowrap border-b border-border p-3 text-xs font-bold tracking-label text-muted-foreground">
                            주소
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {step.services.map((service) => (
                          <tr key={service.name} className="border-b border-border last:border-b-0">
                            <td className="whitespace-nowrap p-3">{service.name}</td>
                            <td className="p-3">
                              <code className="font-mono">{service.url}</code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className={HELP}>{step.help}</p>
                </>
              )}
            </Card>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
