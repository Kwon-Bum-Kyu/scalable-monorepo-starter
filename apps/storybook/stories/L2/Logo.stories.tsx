import { Logo } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

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
