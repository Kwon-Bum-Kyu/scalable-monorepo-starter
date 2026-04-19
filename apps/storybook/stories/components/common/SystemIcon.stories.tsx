import type { SystemIconProps } from "@repo/ui";
import { SystemIcon } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof SystemIcon> = {
  title: "Common/SystemIcon",
  component: SystemIcon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "프로젝트의 표준 아이콘 시스템입니다.",
      },
    },
  },
  argTypes: {
    name: { control: "select", options: ["bars", "search", "info", "close", "circle", "circle-filled", "eye", "eye-slash", "chevron-right", "chevron-left", "chevron-up", "chevron-down", "toggle-on", "toggle-off", "user", "user-circle", "user-outline", "envelope", "envelope-outline", "caret-up", "caret-down", "arrow-up", "arrow-down", "arrow-left", "arrow-right", "check-square", "check-square-outline", "check-circle", "check-circle-outline", "square", "square-outline", "linkedin", "github", "globe"] },
    size: { control: "number" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof SystemIcon>;

export const Default: Story = {
  args: {
    name: "github",
    size: 24,
  } as SystemIconProps,
};
