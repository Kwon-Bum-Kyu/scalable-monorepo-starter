import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { SimpleBreadcrumb } from "@repo/ui";

const meta: Meta<typeof SimpleBreadcrumb> = {
  title: "L3/SimpleBreadcrumb",
  component: SimpleBreadcrumb,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SimpleBreadcrumb>;

export const TwoLevels: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Guide" },
    ],
  },
};
export const ThreeLevels: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "Getting Started" },
    ],
  },
};
export const WithCustomSeparator: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "Getting Started" },
    ],
    separator: <span>›</span>,
  },
};
