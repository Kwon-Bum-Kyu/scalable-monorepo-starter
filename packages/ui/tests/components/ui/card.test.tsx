import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Card", () => {
  it("title과 description이 함께 렌더된다", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>요금제</CardTitle>
          <CardDescription>월 9,900원</CardDescription>
        </CardHeader>
        <CardContent>본문</CardContent>
        <CardFooter>구독하기</CardFooter>
      </Card>,
    );

    expect(screen.getByText("요금제")).toBeInTheDocument();
    expect(screen.getByText("월 9,900원")).toBeInTheDocument();
    expect(screen.getByText("본문")).toBeInTheDocument();
    expect(screen.getByText("구독하기")).toBeInTheDocument();
  });

  it("컨테이너 레벨 radius와 토큰 기반 배경이 적용된다", () => {
    render(
      <Card data-testid="card-root">
        <CardContent>내용</CardContent>
      </Card>,
    );

    const root = screen.getByTestId("card-root");
    expect(root.className).toContain("rounded-lg");
    expect(root.className).toContain("bg-card");
    expect(root.className).toContain("text-card-foreground");
  });

  it("className 추가가 cn 유틸로 병합된다", () => {
    render(
      <Card className="custom-card" data-testid="card-root">
        <CardContent>내용</CardContent>
      </Card>,
    );

    const root = screen.getByTestId("card-root");
    expect(root.className).toContain("custom-card");
    expect(root.className).toContain("rounded-lg");
  });

  it("ref가 루트 div로 전달된다", () => {
    let captured: HTMLDivElement | null = null;
    render(
      <Card
        ref={(node) => {
          captured = node;
        }}
        data-testid="card-root"
      >
        <CardContent>내용</CardContent>
      </Card>,
    );

    expect(captured).not.toBeNull();
    expect(captured).toBeInstanceOf(HTMLDivElement);
  });

  it("semantic landmark 역할로 사용할 때 role을 받을 수 있다", () => {
    render(
      <Card role="region" aria-label="요금제 카드">
        <CardHeader>
          <CardTitle>요금제</CardTitle>
        </CardHeader>
      </Card>,
    );

    const region = screen.getByRole("region", { name: "요금제 카드" });
    expect(region).toBeInTheDocument();
  });
});
