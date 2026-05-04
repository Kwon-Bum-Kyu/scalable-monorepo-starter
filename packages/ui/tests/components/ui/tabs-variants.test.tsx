import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Tabs variants 정본 SSOT (Ralph R3c — T1 cva variant 추가)", () => {
  it("variant='underline' (default)일 때 TabsList는 border-b + gap-6를 가진다", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="underline" data-testid="list">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A 콘텐츠</TabsContent>
      </Tabs>,
    );
    const list = screen.getByTestId("list");
    expect(/\bborder-b\b/.test(list.className)).toBe(true);
    expect(
      /\bgap-6\b/.test(list.className),
      `underline variant는 gap-6(=24px)를 가져야 합니다 (실제: ${list.className})`,
    ).toBe(true);
  });

  it("variant='underline'에서 TabsTrigger는 active 시 ::after 2px blue-500과 text-blue-700을 사용한다", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="underline">
          <TabsTrigger value="a" data-testid="trigger-a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">x</TabsContent>
      </Tabs>,
    );
    const trigger = screen.getByTestId("trigger-a");
    expect(
      /data-\[state=active\]:after:bg-blue-500/.test(trigger.className) ||
        /data-\[state=active\]:border-b-blue-500/.test(trigger.className),
      `underline trigger는 active 상태에서 blue-500 underline을 가져야 합니다 (실제: ${trigger.className})`,
    ).toBe(true);
    expect(
      /data-\[state=active\]:text-blue-700/.test(trigger.className),
      `underline trigger는 active text-blue-700이어야 합니다 (실제: ${trigger.className})`,
    ).toBe(true);
  });

  it("variant='pill'일 때 TabsList는 gap-2(8px)를 가지고 muted 배경이 없다", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="pill" data-testid="list">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">x</TabsContent>
      </Tabs>,
    );
    const list = screen.getByTestId("list");
    expect(/\bgap-2\b/.test(list.className)).toBe(true);
    expect(
      /bg-muted/.test(list.className),
      `pill variant는 bg-muted를 사용하지 않아야 합니다 (실제: ${list.className})`,
    ).toBe(false);
  });

  it("variant='pill'에서 TabsTrigger는 rounded-full + active bg-blue-500 text-white를 가진다", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="pill">
          <TabsTrigger value="a" data-testid="trigger">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">x</TabsContent>
      </Tabs>,
    );
    const trigger = screen.getByTestId("trigger");
    expect(/\brounded-full\b/.test(trigger.className)).toBe(true);
    expect(/data-\[state=active\]:bg-blue-500/.test(trigger.className)).toBe(true);
  });
});
