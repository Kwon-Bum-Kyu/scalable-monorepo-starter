import { DatePicker } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DatePicker> = {
  title: "L2/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = { args: {} };
export const WithPlaceholder: Story = {
  args: { placeholder: "날짜를 고르세요" },
};
export const Disabled: Story = { args: { disabled: true } };
