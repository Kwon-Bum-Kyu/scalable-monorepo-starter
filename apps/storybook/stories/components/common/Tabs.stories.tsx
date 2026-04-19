import type { TabsProps } from "@repo/ui";
import { Tabs } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof Tabs> = {
  title: "Common/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "콘텐츠를 여러 탭으로 구성하여 보여주는 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    tabs: { control: "object" },
    activeTab: { control: "text" },
    onChange: { action: "changed" },
    variant: { control: "radio", options: ["underline", "pill"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const TabsWithState = (args: TabsProps) => {
  const [activeTab, setActiveTab] = useState(args.activeTab);
  return <Tabs {...args} activeTab={activeTab} onChange={setActiveTab} />;
};

export const Underline: Story = {
  args: {
    tabs: ["Tab 1", "Tab 2", "Tab 3"],
    activeTab: "Tab 1",
    variant: "underline",
  } as TabsProps,
  render: (args: TabsProps) => <TabsWithState {...args} />,
};
