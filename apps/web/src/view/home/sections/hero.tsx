import { Button } from "@repo/ui";
import type React from "react";

import heroGuideSrc from "@/assets/hero-guide.png";
import PageContainer from "@/components/layouts/PageContainer";
import { REPO_URL } from "@/config/links";
import { scrollToSection } from "@/utils/scrollToSection";
import { HERO } from "@/view/home/homeData";

export function HeroSection(): React.JSX.Element {
  return (
    <section id="hero" aria-labelledby="hero-title" className="pt-12 pb-16 tablet:py-20">
      <PageContainer>
        <div className="grid grid-cols-1 gap-y-10 desktop:grid-cols-12 desktop:items-center desktop:gap-x-4">
          <div className="flex flex-col desktop:col-span-6">
            <h1
              id="hero-title"
              tabIndex={-1}
              className="text-3xl font-bold focus:outline-none tablet:text-5xl"
            >
              {HERO.title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground tablet:mt-6 tablet:text-xl">
              {HERO.lead}
            </p>
            <div className="mt-6 flex flex-col gap-3 tablet:mt-8 tablet:flex-row tablet:flex-wrap">
              <Button
                size="lg"
                className="w-full tablet:w-auto"
                onClick={() => scrollToSection("quickstart")}
              >
                시작하기
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full tablet:w-auto"
              >
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                  GitHub에서 보기
                </a>
              </Button>
            </div>
            <ul
              aria-label="핵심 목표"
              className="mt-8 grid grid-cols-2 gap-4 tablet:mt-10 tablet:gap-8"
            >
              {HERO.goals.map((goal) => (
                <li key={goal.value} className="grid gap-1 border-t border-border pt-3">
                  <p className="text-2xl font-bold tablet:text-3xl">{goal.value}</p>
                  <p className="text-sm text-muted-foreground">{goal.caption}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              {HERO.stack.map((item, index) => (
                <span key={item}>
                  {index > 0 ? " · " : null}
                  <span className="whitespace-nowrap">{item}</span>
                </span>
              ))}
            </p>
          </div>
          <figure className="desktop:col-span-6">
            <img
              src={heroGuideSrc}
              alt="디자인 시스템 가이드 첫 화면"
              width={2560}
              height={1600}
              className="aspect-16/10 h-auto w-full rounded-lg border border-border"
            />
          </figure>
        </div>
      </PageContainer>
    </section>
  );
}
