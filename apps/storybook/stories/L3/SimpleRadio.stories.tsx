import { SimpleRadio } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof SimpleRadio> = {
  title: "L3/SimpleRadio",
  component: SimpleRadio,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimpleRadio>;

const options = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나" },
  { value: "cherry", label: "체리" },
];

export const Vertical: Story = { args: { options, defaultValue: "apple" } };
export const Horizontal: Story = {
  args: { options, defaultValue: "banana", orientation: "horizontal" },
};
export const WithDisabled: Story = {
  args: {
    options: [
      ...options,
      { value: "durian", label: "두리안", disabled: true },
    ],
    defaultValue: "apple",
  },
};
export const AllDisabled: Story = {
  args: { options, defaultValue: "apple", disabled: true },
};
