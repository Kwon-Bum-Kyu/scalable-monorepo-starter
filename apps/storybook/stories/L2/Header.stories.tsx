import { Button, Header, Link, Logo } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof Header> = {
  title: "L2/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

const nav = (
  <>
    <Link
      to="/"
      className="inline-flex items-center self-stretch border-y-2 border-transparent text-sm text-muted-foreground"
    >
      시작하기
    </Link>
    <Link
      to="/structure"
      className="inline-flex items-center self-stretch border-y-2 border-transparent text-sm text-muted-foreground"
    >
      구조
    </Link>
    <Link
      to="/guide"
      aria-current="page"
      className="inline-flex items-center self-stretch border-y-2 border-b-foreground border-t-transparent text-sm font-semibold text-foreground"
    >
      디자인 시스템
    </Link>
    <Link
      to="/examples"
      className="inline-flex items-center self-stretch border-y-2 border-transparent text-sm text-muted-foreground"
    >
      Examples
    </Link>
  </>
);

const actions = (
  <>
    <Button variant="ghost" size="sm">
      로그인
    </Button>
    <Button size="sm">회원가입</Button>
  </>
);

const mobileMenu = (
  <div className="grid px-4 pb-4 pt-2">
    <Link to="/" className="flex min-h-11 items-center text-base">
      시작하기
    </Link>
    <Link to="/structure" className="flex min-h-11 items-center text-base">
      구조
    </Link>
    <Link to="/guide" className="flex min-h-11 items-center text-base font-semibold">
      디자인 시스템
    </Link>
    <Link to="/examples" className="flex min-h-11 items-center text-base">
      Examples
    </Link>
  </div>
);

export const Default: Story = {
  args: { logo: <Logo />, nav, actions },
};

export const WithMobileMenu: Story = {
  args: { logo: <Logo />, nav, actions, mobileMenu },
};

export const LogoOnly: Story = {
  args: { logo: <Logo /> },
};
