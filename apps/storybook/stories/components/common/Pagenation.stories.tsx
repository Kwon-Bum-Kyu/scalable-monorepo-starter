import type { PaginationProps } from "@repo/ui";
import { Pagenation } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof Pagenation> = {
  title: "Common/Pagenation",
  component: Pagenation,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "페이지네이션 UI를 제공하여 콘텐츠를 나вига이션하는 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    current: { control: "number" },
    total: { control: "number" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagenation>;

const PaginationWithState = (args: PaginationProps) => {
  const [current, setCurrent] = useState(args.current);
  return <Pagenation {...args} current={current} onChange={setCurrent} />;
};

export const Default: Story = {
  args: {
    current: 1,
    total: 10,
  } as PaginationProps,
  render: (args: PaginationProps) => <PaginationWithState {...args} />,
};
