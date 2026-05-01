import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = { title: "L1/Card", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>요금제</CardTitle>
        <CardDescription>월 9,900원, 언제든 해지 가능</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">기본 카드 컨텐츠 영역입니다.</p>
      </CardContent>
      <CardFooter>
        <Button>구독하기</Button>
      </CardFooter>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>알림</CardTitle>
        <CardDescription>새로운 업데이트가 있습니다.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">
        <p className="text-sm">헤더 없이 본문만 사용할 수도 있습니다.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooterActions: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>계정 삭제</CardTitle>
        <CardDescription>
          이 작업은 되돌릴 수 없습니다.
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button variant="outline">취소</Button>
        <Button variant="destructive">삭제</Button>
      </CardFooter>
    </Card>
  ),
};
