import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = { title: "L1/Tabs", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings</TabsContent>
      <TabsContent value="password">Password settings</TabsContent>
    </Tabs>
  ),
};
