import { Badge } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Badge> = {
  title: "L1/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge" },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Success: Story = { args: { variant: "success" } };
export const Warn: Story = { args: { variant: "warn" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Square: Story = { args: { shape: "sq" } };
