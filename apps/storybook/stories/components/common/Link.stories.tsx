import type { LinkProps } from "@repo/ui";
import { Link } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof Link> = {
  title: "Common/Link",
  component: Link,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: "내부 페이지 이동에 사용되는 링크 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    to: { control: "text" },
    children: { control: "text" },
    disabled: { control: "boolean" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    to: "/",
    children: "Go to Home",
  } as LinkProps,
};

export const Disabled: Story = {
  args: {
    to: "/",
    children: "Disabled Link",
    disabled: true,
  } as LinkProps,
};
