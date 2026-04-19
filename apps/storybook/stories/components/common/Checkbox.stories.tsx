import type { CheckboxProps } from "@repo/ui";
import { Checkbox } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Checkbox> = {
  title: "Common/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "단일 선택 또는 다중 선택을 위한 체크박스 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    label: {
      description: "체크박스 옆에 표시될 텍스트 레이블입니다.",
      control: { type: "text" },
    },
    disabled: {
      description: "체크박스를 비활성화합니다.",
      control: { type: "boolean" },
    },
    checked: {
      description: "체크박스의 선택 여부를 제어합니다.",
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Checkbox Label",
    checked: false,
    disabled: false,
    onChange: () => {},
  } as CheckboxProps,
};

export const Checked: Story = {
  args: {
    label: "Checkbox Label",
    checked: true,
    disabled: false,
    onChange: () => {},
  } as CheckboxProps,
};

export const Disabled: Story = {
  args: {
    label: "Checkbox Label",
    checked: false,
    disabled: true,
    onChange: () => {},
  } as CheckboxProps,
};
