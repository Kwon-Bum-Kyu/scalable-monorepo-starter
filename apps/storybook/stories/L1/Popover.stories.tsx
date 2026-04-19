import type { Meta, StoryObj } from "@storybook/react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@repo/ui";

const meta: Meta = { title: "L1/Popover", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <p className="text-sm">팝오버 내부 컨텐츠입니다.</p>
      </PopoverContent>
    </Popover>
  ),
};
