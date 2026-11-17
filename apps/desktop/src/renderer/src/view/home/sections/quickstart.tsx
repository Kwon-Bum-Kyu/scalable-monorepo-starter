import { Card } from "@repo/ui";
import type React from "react";

import DataTable from "@/components/DataTable";
import InlineCode from "@/components/InlineCode";
import CodeBlock from "@/view/home/CodeBlock";
import { QUICKSTART_STEPS, type QuickstartStep } from "@/view/home/homeData";
import { HomeSection, SectionHead } from "@/view/home/primitives";

const HELP = "text-sm text-muted-foreground";
const LINK = "underline underline-offset-2 hover:text-foreground";

const serviceRows = (
  services: ReadonlyArray<{ name: string; url: string }>,
): React.JSX.Element[] =>
  services.map((service) => (
    <tr key={service.name} className="border-b border-border last:border-b-0">
      <td className="whitespace-nowrap p-3">{service.name}</td>
      <td className="p-3">
        <code className="font-mono">{service.url}</code>
      </td>
    </tr>
  ));

function StepBody({ step }: { step: QuickstartStep }): React.JSX.Element {
  if (step.number === "01") {
    const { create, version } = step;
    return (
      <div className="grid items-start gap-6 desktop:grid-cols-2 desktop:gap-8">
        <div className="grid gap-2">
          <CodeBlock segments={create.code} />
          {create.help.map((text) => (
            <p key={text} className={HELP}>
              <InlineCode text={text} />
            </p>
          ))}
        </div>
        <div className="grid gap-2 desktop:border-l desktop:border-border desktop:pl-6">
          <p className="text-sm font-semibold">{version.subtitle}</p>
          <CodeBlock segments={version.code} />
          {version.help.map((text) => (
            <p key={text} className={HELP}>
              <InlineCode text={text} />
            </p>
          ))}
          <p className={HELP}>
            <InlineCode text={version.findHelp.before} />
            <a className={LINK} href={version.releasesUrl}>
              {version.findHelp.linkLabel}
            </a>
            {version.findHelp.after}
          </p>
        </div>
      </div>
    );
  }
  if (step.number === "02") {
    return (
      <>
        <CodeBlock segments={step.code} />
        <p className={HELP}>
          <InlineCode text={step.help} />
        </p>
        <DataTable head={["명령", "띄우는 앱", "사전 조건"]}>
          {step.commands.map((row) => (
            <tr key={row.command} className="border-b border-border last:border-b-0">
              <td className="whitespace-nowrap p-3">
                <code className="font-mono">{row.command}</code>
              </td>
              <td className="p-3">{row.apps}</td>
              <td className="p-3">{row.precondition}</td>
            </tr>
          ))}
        </DataTable>
        <p className={HELP}>
          <InlineCode text={step.note} />
        </p>
      </>
    );
  }
  return (
    <>
      <DataTable head={["서비스", "주소"]}>{serviceRows(step.services)}</DataTable>
      <p className={HELP}>{step.help}</p>
    </>
  );
}

export function QuickstartSection(): React.JSX.Element {
  return (
    <HomeSection id="quickstart">
      <SectionHead
        id="quickstart"
        eyebrow="시작하기 · Quickstart"
        title="세 단계로 프로젝트를 만들고 필요한 앱만 띄웁니다."
      />
      <ol className="grid grid-cols-1 gap-4 desktop:grid-cols-2">
        {QUICKSTART_STEPS.map((step) => (
          <li key={step.number} className={step.number === "01" ? "desktop:col-span-2" : undefined}>
            <Card variant="flat" className="flex h-full flex-col gap-4 p-5 tablet:p-6">
              <div className="grid gap-1">
                <p className="font-display text-sm font-bold tracking-label text-muted-foreground">
                  {step.number}
                </p>
                <h3 className="text-lg font-semibold tablet:text-xl">{step.title}</h3>
              </div>
              <StepBody step={step} />
            </Card>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
