import type { ButtonProps } from "@repo/ui";
import { Button } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "기본 버튼 컴포넌트입니다. `primary` / `secondary` 변형과 disabled 상태를 지원합니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
      description: "버튼 스타일",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 여부",
    },
    children: {
      control: "text",
      description: "버튼 텍스트 또는 콘텐츠",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
    disabled: false,
  } as ButtonProps,
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
    disabled: false,
  } as ButtonProps,
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Button",
    disabled: true,
  } as ButtonProps,
};
