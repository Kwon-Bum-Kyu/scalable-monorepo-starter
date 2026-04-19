import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Link } from "@repo/ui";

const meta: Meta<typeof Link> = {
  title: "L2/Link",
  component: Link,
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
type Story = StoryObj<typeof Link>;

export const Internal: Story = { args: { to: "/home", children: "Home" } };
export const External: Story = {
  args: {
    to: "https://example.com",
    external: true,
    children: "External Link",
  },
};
