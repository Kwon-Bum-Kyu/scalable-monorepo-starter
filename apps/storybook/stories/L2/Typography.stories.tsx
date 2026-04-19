import { Typography } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Typography> = {
  title: "L2/Typography",
  component: Typography,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const H1: Story = { args: { variant: "h1", children: "H1 Title" } };
export const H2: Story = { args: { variant: "h2", children: "H2 Title" } };
export const Paragraph: Story = {
  args: { variant: "paragraph", children: "본문 문단 텍스트입니다." },
};
export const Small: Story = {
  args: { variant: "small", children: "Small caption" },
};
