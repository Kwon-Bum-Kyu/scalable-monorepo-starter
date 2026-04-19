import type { InputProps } from "@repo/ui";
import { Input } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Input> = {
  title: "Common/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "사용자 입력을 위한 폼 필드입니다. 다양한 상태(기본, 오류, 비활성화)를 지원합니다.",
      },
    },
  },
  argTypes: {
    label: {
      description: "입력 필드 위에 표시될 레이블입니다.",
      control: { type: "text" },
    },
    placeholder: {
      description: "입력 필드에 표시될 플레이스홀더 텍스트입니다.",
      control: { type: "text" },
    },
    assistiveText: {
      description: "입력 필드 아래에 표시될 보조 텍스트입니다.",
      control: { type: "text" },
    },
    errorMessage: {
      description:
        "오류 상태일 때 표시될 메시지입니다. 이 값이 있으면 오류 스타일이 적용됩니다.",
      control: { type: "text" },
    },
    disabled: {
      description: "입력 필드를 비활성화합니다.",
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Label",
    placeholder: "Text input",
    assistiveText: "Assistive text",
    disabled: false,
  } as InputProps,
};

export const WithError: Story = {
  args: {
    label: "Label",
    placeholder: "Text input",
    errorMessage: "Error message",
    disabled: false,
  } as InputProps,
};
