export type GuideSectionId =
  | "principles" | "color" | "type" | "space" | "bp" | "components"
  | "concept" | "logos" | "clear" | "misuse" | "icons" | "files";

export interface GuideNavItem { id: GuideSectionId; label: string }
export interface GuideNavGroup { title: string; items: ReadonlyArray<GuideNavItem> }

export const GUIDE_NAV_GROUPS: ReadonlyArray<GuideNavGroup> = [
  { title: "시작", items: [{ id: "principles", label: "원칙" }] },
  { title: "토큰", items: [
    { id: "color", label: "컬러" },
    { id: "type", label: "타이포그래피" },
    { id: "space", label: "스페이싱 · 라운딩 · 그림자" },
    { id: "bp", label: "브레이크포인트" },
  ] },
  { title: "컴포넌트", items: [{ id: "components", label: "기본 컴포넌트" }] },
  { title: "브랜드", items: [
    { id: "concept", label: "공유 루트" },
    { id: "logos", label: "로고 조합" },
    { id: "clear", label: "클리어 스페이스 · 최소 크기" },
    { id: "misuse", label: "잘못된 사용 예" },
    { id: "icons", label: "시스템 아이콘" },
    { id: "files", label: "파일 목록" },
  ] },
];

export const GUIDE_SECTION_IDS: ReadonlyArray<GuideSectionId> =
  GUIDE_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.id));

export const PRINCIPLES = [
  { title: "Tokens first", description: "하드코딩 색·픽셀 금지. 항상 `var(--color-*)` 사용." },
  { title: "shadcn 호환", description: "컴포넌트 API는 variant·size 패턴 유지." },
  { title: "Mobile-first", description: "기본은 모바일, 미디어 쿼리로 확장." },
  { title: "Type-safe", description: "props는 union 타입으로 좁히기." },
  { title: "Accessibility", description: "aria-label, focus ring, 44px 터치 타겟." },
  { title: "적게, 명확하게", description: "variants는 6개 이하. 신중히 추가." },
] as const;
