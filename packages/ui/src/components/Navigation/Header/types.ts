export type HeaderProps =
  | { isLoggedIn: true; username?: string; onLogout: () => void; logoText?: string }
  | { isLoggedIn: false; username?: string; onLogout?: never; logoText?: string };
