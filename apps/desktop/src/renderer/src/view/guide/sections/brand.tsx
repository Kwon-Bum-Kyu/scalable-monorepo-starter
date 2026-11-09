import { Badge, Card, cn, SystemIcon } from "@repo/ui";

import InlineCode from "@/components/InlineCode";
import {
  BRAND_FILES,
  BRAND_SYMBOL_SRC,
  CONCEPT_ROWS,
  LOGO_VARIANTS,
  MIN_SIZES,
  MISUSE_EXAMPLES,
  type MisuseExample,
  SYSTEM_ICON_NAMES,
  SYSTEM_ICON_SAMPLES,
} from "@/view/guide/brandData";
import { GuideSection, GuideTable, TD } from "@/view/guide/primitives";

const TILE = "grid min-h-36 place-items-center rounded-lg border p-4";
const TRACK_ROW = "grid gap-4 desktop:flex desktop:items-start";

export const ConceptSection = () => (
  <GuideSection id="concept" eyebrow="브랜드" title="공유 루트">
    <div className={TRACK_ROW}>
      <div className={`${TILE} border-border bg-background desktop:w-68 desktop:shrink-0`}>
        <img src={BRAND_SYMBOL_SRC} alt="scalable-monorepo-starter 심볼" width={160} height={128} />
      </div>
      <div className="min-w-0 flex-1">
        <GuideTable head={["요소", "의미"]}>
          {CONCEPT_ROWS.map((row) => (
            <tr key={row.term} className="group">
              <td className={`${TD} whitespace-nowrap`}>{row.term}</td>
              <td className={TD}>
                <InlineCode text={row.meaning} />
              </td>
            </tr>
          ))}
        </GuideTable>
      </div>
    </div>
  </GuideSection>
);

export const LogosSection = () => (
  <GuideSection id="logos" eyebrow="브랜드" title="로고 조합 4종">
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
      {LOGO_VARIANTS.map((logo) => (
        <figure key={logo.key} className="grid content-start gap-4">
          <div className={`${TILE} border-border bg-background`}>
            <img src={logo.lightSrc} alt={logo.lightAlt} width={logo.width} height={logo.height} />
          </div>
          <div className={`${TILE} border-gray-900 bg-gray-900`}>
            <img src={logo.darkSrc} alt={logo.darkAlt} width={logo.width} height={logo.height} />
          </div>
          <figcaption className="grid content-start gap-1">
            <p className="font-semibold">{logo.name}</p>
            <p className="text-sm text-muted-foreground">{logo.usage}</p>
            <code className="text-xs">{logo.file}</code>
          </figcaption>
        </figure>
      ))}
    </div>
  </GuideSection>
);

export const ClearSpaceSection = () => (
  <GuideSection id="clear" eyebrow="브랜드" title="클리어 스페이스와 최소 크기">
    <div className={TRACK_ROW}>
      <Card variant="flat" className="grid justify-items-center gap-4 p-6 desktop:w-92 desktop:shrink-0">
        <div className="border border-dashed border-border-strong p-8">
          <img src={BRAND_SYMBOL_SRC} alt="클리어 스페이스 도식의 심볼" width={160} height={128} />
        </div>
        <p className="text-sm text-muted-foreground">
          점선 = 최소 여백 1x. x는 심볼 기둥 너비이며 심볼 너비의 1/5입니다.
        </p>
      </Card>
      <div className="min-w-0 flex-1">
        <GuideTable head={["구성", "최소 크기"]}>
          {MIN_SIZES.map((row) => (
            <tr key={row.part} className="group">
              <td className={TD}>{row.part}</td>
              <td className={`${TD} whitespace-nowrap`}>{row.size}</td>
            </tr>
          ))}
        </GuideTable>
      </div>
    </div>
  </GuideSection>
);

const MisuseCard = ({ example }: { example: MisuseExample }) => (
  <Card variant="flat" className="grid content-start gap-3 p-5">
    <div
      className={cn(
        "grid min-h-28 overflow-hidden rounded-md border border-border",
        example.fill ? "place-items-stretch" : "place-items-center",
        example.artClassName,
      )}
    >
      {example.src ? (
        <img src={example.src} alt={example.alt} className={example.imgClassName} />
      ) : (
        <span className="flex items-center gap-2 font-mono text-sm font-bold">
          <img src={BRAND_SYMBOL_SRC} alt="" width={40} height={32} />
          <span className="whitespace-nowrap">scalable-monorepo-starter</span>
        </span>
      )}
    </div>
    <div>
      <Badge variant="destructive">금지</Badge>
    </div>
    <h3 className="text-base font-semibold">{example.title}</h3>
    <p className="text-sm text-muted-foreground">
      <InlineCode text={example.description} />
    </p>
  </Card>
);

export const MisuseSection = () => (
  <GuideSection id="misuse" eyebrow="브랜드" title="잘못된 사용 예">
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
      {MISUSE_EXAMPLES.map((example) => (
        <MisuseCard key={example.title} example={example} />
      ))}
    </div>
  </GuideSection>
);

export const IconsSection = () => (
  <GuideSection id="icons" eyebrow="브랜드" title="시스템 아이콘">
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 desktop:grid-cols-4">
      {SYSTEM_ICON_SAMPLES.map((name) => (
        <Card key={name} variant="flat" className="flex items-center gap-3 p-4">
          <SystemIcon name={name} size={24} aria-hidden />
          <code className="text-sm">{name}</code>
        </Card>
      ))}
      <Card variant="flat" className="p-4 tablet:col-span-3 desktop:col-span-4">
        <p className="text-sm text-muted-foreground">그 밖의 SystemIcon 이름</p>
        <ul aria-label="SystemIcon 이름 목록" className="mt-3 flex flex-wrap gap-1.5">
          {SYSTEM_ICON_NAMES.map((name) => (
            <li key={name} className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-xs">
              {name}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </GuideSection>
);

export const FilesSection = () => (
  <GuideSection id="files" eyebrow="브랜드" title="파일 목록">
    <GuideTable head={["파일", "용도"]} className="min-w-150">
      {BRAND_FILES.map((row) => (
        <tr key={row.file} className="group">
          <td className={TD}>
            <code>{row.file}</code>
          </td>
          <td className={TD}>{row.usage}</td>
        </tr>
      ))}
    </GuideTable>
  </GuideSection>
);
