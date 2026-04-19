import { cn } from "@repo/ui/lib/utils";
import { Menu, X } from "lucide-react";
import * as React from "react";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  nav?: React.ReactNode;
  actions?: React.ReactNode;
  mobileMenu?: React.ReactNode;
}

function Header({
  logo,
  nav,
  actions,
  mobileMenu,
  className,
  ...props
}: HeaderProps): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuId = React.useId();
  const hasMobileMenu = !!mobileMenu;

  return (
    <header
      className={cn(
        "w-full border-b border-border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 w-full max-w-app items-center justify-between px-6">
        {logo && <div className="flex items-center">{logo}</div>}

        {nav && (
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 md:flex"
          >
            {nav}
          </nav>
        )}

        {actions && (
          <div className="hidden items-center gap-3 md:flex">{actions}</div>
        )}

        {hasMobileMenu && (
          <button
            type="button"
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {hasMobileMenu && isOpen && (
        <div
          id={menuId}
          className="border-t border-border bg-background md:hidden"
        >
          {mobileMenu}
        </div>
      )}
    </header>
  );
}

export { Header };
