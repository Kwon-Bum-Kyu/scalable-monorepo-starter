import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/carousel";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Carousel", () => {
  it("기본 carousel이 렌더된다", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>슬라이드 1</CarouselItem>
          <CarouselItem>슬라이드 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getByText("슬라이드 1")).toBeInTheDocument();
  });

  it("이전/다음 버튼이 노출된다", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>A</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    expect(
      screen.getByRole("button", { name: /previous slide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next slide/i }),
    ).toBeInTheDocument();
  });
});
