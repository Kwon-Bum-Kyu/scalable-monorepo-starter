export type SidebarLink = {
  href: string;
  label: string;
  external?: boolean;
};
export type SidebarGroup = { title: string; links: ReadonlyArray<SidebarLink> };

export const REPO_URL =
  "https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter";

export const SIDEBAR_GROUPS: ReadonlyArray<SidebarGroup> = [
  {
    title: "시작",
    links: [
      { href: "#overview", label: "개요" },
      { href: "#principles", label: "원칙" },
    ],
  },
  {
    title: "토큰",
    links: [
      { href: "#colors", label: "컬러" },
      { href: "#type", label: "타이포그래피" },
      { href: "#spacing", label: "스페이싱 · 라운딩 · 그림자" },
      { href: "#breakpoints", label: "브레이크포인트" },
    ],
  },
  {
    title: "컴포넌트",
    links: [
      { href: "#components", label: "기본 컴포넌트" },
      { href: "#brand", label: "로고 · 아이콘" },
    ],
  },
  {
    title: "참고",
    links: [
      { href: "#overview", label: "README" },
      { href: REPO_URL, label: "monorepo starter ↗", external: true },
    ],
  },
];

export const PRINCIPLES: ReadonlyArray<{
  title: string;
  description: string;
}> = [
  {
    title: "Tokens first",
    description: "하드코딩 색·픽셀 금지. 항상 var(--color-*) 사용.",
  },
  {
    title: "shadcn 호환",
    description: "컴포넌트 API는 variant·size 패턴 유지.",
  },
  { title: "Mobile-first", description: "기본은 모바일, 미디어 쿼리로 확장." },
  { title: "Type-safe", description: "props는 union 타입으로 좁히기." },
  {
    title: "Accessibility",
    description: "aria-label, focus ring, 44px 터치 타겟.",
  },
  {
    title: "적게, 명확하게",
    description: "variants는 6개 이하. 신중히 추가.",
  },
];

export const BREAKPOINTS: ReadonlyArray<{
  name: string;
  width: string;
  columns: string;
  margin: string;
  gutter: string;
}> = [
  {
    name: "Mobile",
    width: "< 768px",
    columns: "4",
    margin: "16px",
    gutter: "16px",
  },
  {
    name: "Tablet",
    width: "768 – 1279px",
    columns: "8",
    margin: "32px",
    gutter: "16px",
  },
  {
    name: "Desktop",
    width: "≥ 1280px",
    columns: "12",
    margin: "72px",
    gutter: "16px",
  },
];
