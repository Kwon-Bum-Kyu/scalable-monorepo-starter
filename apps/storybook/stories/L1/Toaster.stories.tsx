import { Button, toast, Toaster } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Toaster> = {
  title: "L1/Toaster",
  component: Toaster,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <div className="flex gap-2">
        <Button variant="destructive" onClick={() => toast.error("알 수 없는 오류")}>
          오류 토스트
        </Button>
        <Button onClick={() => toast.success("저장했습니다.")}>
          성공 토스트
        </Button>
      </div>
      <Toaster />
    </>
  ),
};
