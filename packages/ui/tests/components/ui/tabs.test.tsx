import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

describe("Tabs", () => {
  it("기본 탭 그룹이 렌더된다", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A 콘텐츠</TabsContent>
        <TabsContent value="b">B 콘텐츠</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("tab", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "B" })).toBeInTheDocument();
  });

  it("defaultValue에 해당하는 패널만 표시된다", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A 콘텐츠</TabsContent>
        <TabsContent value="b">B 콘텐츠</TabsContent>
      </Tabs>
    );
    expect(screen.getByText("A 콘텐츠")).toBeInTheDocument();
  });
});
