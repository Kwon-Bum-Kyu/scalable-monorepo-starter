import { Header } from "@repo/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

/**
 * Header 컴포넌트는 네비게이션 역할을 하며
 *
 * - 로그인 상태일 경우: 유저 이름과 메뉴가 표시됩니다.
 * - 비로그인 상태일 경우: 로그인 및 회원가입 버튼이 표시됩니다.
 *
 * 반응형 레이아웃을 지원하며, 모바일에서는 햄버거 메뉴로 동작합니다.
 */
const meta: Meta<typeof Header> = {
  title: "Common/Header",
  component: Header,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Header 컴포넌트는 사이트 상단 네비게이션 역할을 하며 로그인 상태에 따라 메뉴를 다르게 표시합니다.`,
      },
    },
  },
  argTypes: {
    isLoggedIn: {
      description: "로그인 여부를 설정합니다.",
      control: { type: "boolean" },
      defaultValue: false,
    },
    username: {
      description: "로그인 상태일 때 표시할 사용자 이름입니다.",
      control: { type: "text" },
      defaultValue: "",
    },
    onLogout: {
      description: "로그아웃 버튼 클릭 시 호출되는 콜백입니다. isLoggedIn=true일 때 필수.",
      action: "logout",
    },
    logoText: {
      description: "헤더 로고 텍스트입니다.",
      control: { type: "text" },
      defaultValue: "Logo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    username: "KBK",
    onLogout: () => {},
  },
  parameters: {
    viewport: { defaultViewport: "desktop" },
    docs: {
      description: {
        story: "로그인 상태의 헤더 UI입니다. 유저 이름과 메뉴가 표시됩니다.",
      },
    },
  },
};

export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
    username: "",
  },
  parameters: {
    viewport: { defaultViewport: "desktop" },
    docs: {
      description: {
        story:
          "로그아웃 상태의 헤더 UI입니다. 로그인/회원가입 버튼이 표시됩니다.",
      },
    },
  },
};

export const MobileLoggedIn: Story = {
  args: {
    isLoggedIn: true,
    username: "KBK",
    onLogout: () => {},
  },
  parameters: {
    viewport: { defaultViewport: "mobile" },
    docs: {
      description: {
        story: "모바일 뷰의 로그인 상태 헤더입니다. 햄버거 메뉴가 표시됩니다.",
      },
    },
  },
};

export const MobileLoggedOut: Story = {
  args: {
    isLoggedIn: false,
    username: "",
  },
  parameters: {
    viewport: { defaultViewport: "mobile" },
    docs: {
      description: {
        story: "모바일 뷰의 로그아웃 상태 헤더입니다. 햄버거 메뉴가 표시됩니다.",
      },
    },
  },
};
