import type { TypographyProps } from "@repo/ui";
import { Typography } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Typography> = {
  title: "Common/Typography",
  component: Typography,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "텍스트 스타일을 위한 타이포그래피 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "large", "paragraph", "small", "xsmall"],
    },
    children: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    variant: "paragraph",
    children: "Typography text example",
  } as TypographyProps,
};

export const H1: Story = { args: { variant: "h1", children: "Heading 1 — 56px / 72px" } as TypographyProps };
export const H2: Story = { args: { variant: "h2", children: "Heading 2 — 48px / 64px" } as TypographyProps };
export const H3: Story = { args: { variant: "h3", children: "Heading 3 — 40px / 48px" } as TypographyProps };
export const H4: Story = { args: { variant: "h4", children: "Heading 4 — 32px / 40px" } as TypographyProps };
export const H5: Story = { args: { variant: "h5", children: "Heading 5 — 24px / 32px" } as TypographyProps };
export const H6: Story = { args: { variant: "h6", children: "Heading 6 — 20px / 32px" } as TypographyProps };
export const Large: Story = { args: { variant: "large", children: "Large — 18px / 24px" } as TypographyProps };
export const Paragraph: Story = { args: { variant: "paragraph", children: "Paragraph — 16px / 24px" } as TypographyProps };
export const Small: Story = { args: { variant: "small", children: "Small — 14px / 24px" } as TypographyProps };
export const XSmall: Story = { args: { variant: "xsmall", children: "XSmall — 12px / 16px" } as TypographyProps };
