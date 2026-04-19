import type { Meta, StoryObj } from "@storybook/react";
import { Button, Empty, SystemIcon } from "@repo/ui";

const meta: Meta<typeof Empty> = {
  title: "L2/Empty",
  component: Empty,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Empty>;

export const TitleOnly: Story = { args: { title: "데이터가 없습니다" } };
export const WithDescription: Story = {
  args: {
    title: "비어 있음",
    description: "추가 정보를 입력하세요",
  },
};
export const WithIconAndAction: Story = {
  args: {
    title: "검색 결과 없음",
    description: "다른 키워드로 시도해 보세요",
    icon: <SystemIcon name="search" size={32} />,
    action: <Button variant="outline">다시 검색</Button>,
  },
};
