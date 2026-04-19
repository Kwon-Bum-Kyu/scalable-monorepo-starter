import type { BreadcrumbProps } from "@repo/ui";
import { Breadcrumb } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof Breadcrumb> = {
  title: "Common/Breadcrumb",
  component: Breadcrumb,
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
        component:
          "페이지 상단에 현재 위치를 경로 형태로 보여주는 Breadcrumb 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    items: {
      description: "Breadcrumb 항목 리스트",
      control: { type: "object" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "Components", href: "/docs/components" },
      { label: "Breadcrumb" },
    ],
  } as BreadcrumbProps,
};
