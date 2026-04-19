import { SimpleSelect } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof SimpleSelect> = {
  title: "L3/SimpleSelect",
  component: SimpleSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimpleSelect>;

const options = [
  { value: "kr", label: "대한민국" },
  { value: "us", label: "미국" },
  { value: "jp", label: "일본" },
];

export const Default: Story = { args: { options, placeholder: "국가 선택" } };
export const WithDefaultValue: Story = {
  args: { options, defaultValue: "kr" },
};
export const WithDisabledOption: Story = {
  args: {
    options: [...options, { value: "cn", label: "중국", disabled: true }],
    placeholder: "국가 선택",
  },
};
export const Disabled: Story = {
  args: { options, defaultValue: "kr", disabled: true },
};
