import { Slider } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Slider> = {
  title: "L1/Slider",
  component: Slider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: [50], max: 100, step: 1 },
  render: (args) => <Slider {...args} className="w-[320px]" />,
};

export const Disabled: Story = {
  args: { defaultValue: [50], disabled: true },
  render: (args) => <Slider {...args} className="w-[320px]" />,
};
