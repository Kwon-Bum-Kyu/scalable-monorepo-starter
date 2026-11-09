import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageContainer from "@/components/layouts/PageContainer";

describe("PageContainer", () => {
  it("[페이지 컨테이너]가 콘텐츠를 감쌀 때 공통 폭과 반응형 여백을 적용한다", () => {
    render(<PageContainer className="custom">내용</PageContainer>);

    expect(screen.getByText("내용")).toHaveClass(
      "mx-auto",
      "w-full",
      "max-w-app",
      "px-4",
      "tablet:px-8",
      "desktop:px-page-x",
      "custom",
    );
  });
});
