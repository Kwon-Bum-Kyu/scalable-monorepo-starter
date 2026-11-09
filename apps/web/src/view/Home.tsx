import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import PageContainer from "@/components/layouts/PageContainer";
import {
  type HomeScrollState,
  scrollToSection,
} from "@/utils/scrollToSection";

const SECTIONS = [
  {
    id: "hero",
    level: 1,
    title: "2시간 안에 셋업하고 1주 안에 배포하는 풀스택 모노레포 스타터.",
  },
  { id: "structure", level: 2, title: "공유 루트" },
  {
    id: "quickstart",
    level: 2,
    title: "네 단계로 로컬 개발 환경을 띄웁니다.",
  },
  { id: "rules", level: 2, title: "바꾸지 않는 규칙 아홉 가지." },
  {
    id: "design-system",
    level: 2,
    title: "토큰과 컴포넌트, 브랜드 규칙은 가이드에서 확인합니다.",
  },
] as const;

export default function Home(): React.JSX.Element {
  const { state } = useLocation();

  useEffect(() => {
    const scrollState = state as HomeScrollState | null;
    if (scrollState?.scrollTo) scrollToSection(scrollState.scrollTo);
  }, [state]);

  return (
    <>
      {SECTIONS.map(({ id, level, title }) => (
        <section key={id} id={id} aria-labelledby={`${id}-title`}>
          <PageContainer>
            {level === 1 ? (
              <h1 id={`${id}-title`}>{title}</h1>
            ) : (
              <h2 id={`${id}-title`}>{title}</h2>
            )}
          </PageContainer>
        </section>
      ))}
    </>
  );
}
