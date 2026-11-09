export type HomeSectionId =
  | "hero"
  | "structure"
  | "quickstart"
  | "rules"
  | "design-system";

export interface HomeScrollState {
  scrollTo: HomeSectionId;
}

/** id 요소를 화면 위로 스크롤한다. 요소가 없으면 아무것도 하지 않는다. URL 해시를 바꾸지 않는다. */
export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ block: "start" });
}
