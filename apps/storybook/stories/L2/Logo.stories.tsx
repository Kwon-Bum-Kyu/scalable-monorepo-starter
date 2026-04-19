import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Logo } from "@repo/ui";

const meta: Meta<typeof Logo> = {
  title: "L2/Logo",
  component: Logo,
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
type Story = StoryObj<typeof Logo>;

export const Default: Story = { args: {} };
export const CustomAlt: Story = { args: { alt: "MY BRAND" } };
