import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = { title: "L1/Tooltip", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>도움말 텍스트</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">기본 열림</Button>
        </TooltipTrigger>
        <TooltipContent>defaultOpen 시 즉시 표시됩니다.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const SidePlacement: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-8 p-12">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side} defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>side={side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};
