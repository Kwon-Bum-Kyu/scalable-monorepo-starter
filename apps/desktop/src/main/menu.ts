import { Menu } from "electron";

// 애플리케이션 메뉴 템플릿을 구성한다. macOS에서는 앱 메뉴를 앞에 둔다.
export function buildMenuTemplate(): Electron.MenuItemConstructorOptions[] {
  const template: Electron.MenuItemConstructorOptions[] = [];

  if (process.platform === "darwin") {
    template.push({ role: "appMenu" });
  }

  template.push({ role: "editMenu" }, { role: "viewMenu" }, { role: "windowMenu" });

  return template;
}

// 구성한 템플릿을 애플리케이션 메뉴로 적용한다.
export function applyApplicationMenu(): void {
  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenuTemplate()));
}
