import {
  cn,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import type React from "react";

import { GUIDE_NAV_GROUPS, type GuideSectionId } from "@/view/guide/navData";

export interface GuideNavProps {
  activeId: GuideSectionId;
  onSelect: (id: GuideSectionId) => void;
}

const ITEM_BASE =
  "block w-full border-l-2 px-3 py-1.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:ring-offset-0";

export function GuideSidebar({ activeId, onSelect }: GuideNavProps): React.JSX.Element {
  return (
    <nav aria-label="가이드 섹션" className="grid gap-6">
      {GUIDE_NAV_GROUPS.map((group) => (
        <div key={group.title} className="grid gap-1">
          <p className="mb-1 pl-3 text-xs font-bold tracking-eyebrow text-muted-foreground">{group.title}</p>
          {group.items.map((item) =>
            item.id === activeId ? (
              <button
                key={item.id}
                type="button"
                aria-current="true"
                onClick={() => onSelect(item.id)}
                className={cn(ITEM_BASE, "border-foreground font-semibold text-foreground")}
              >
                {item.label}
              </button>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(ITEM_BASE, "border-transparent text-muted-foreground hover:text-foreground")}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      ))}
    </nav>
  );
}

export function GuideSectionSelect({ activeId, onSelect }: GuideNavProps): React.JSX.Element {
  return (
    <div className="sticky top-0 z-2 grid gap-1 border-b border-border bg-background px-4 pb-3 pt-2 tablet:px-8 desktop:hidden">
      <Label htmlFor="guide-section-select" className="text-xs font-bold leading-4 tracking-eyebrow text-muted-foreground">
        가이드 섹션
      </Label>
      <Select value={activeId} onValueChange={(value) => onSelect(value as GuideSectionId)}>
        <SelectTrigger id="guide-section-select" className="h-11 text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {GUIDE_NAV_GROUPS.map((group) => (
            <SelectGroup key={group.title}>
              <SelectLabel>{group.title}</SelectLabel>
              {group.items.map((item) => (
                <SelectItem key={item.id} value={item.id} className="min-h-11">
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
