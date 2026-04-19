import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { HeaderProps } from "./types";

const menuId = "mobile-nav";

function Header({
  isLoggedIn,
  username,
  onLogout,
  logoText = "Logo",
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const displayName = username?.trim() || "사용자";

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (isLoggedIn) onLogout();
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      firstLinkRef.current?.focus();
    } else {
      buttonRef.current?.focus();
    }
  }, [isMenuOpen]);

  return (
    <header className="w-full bg-(--color-bg-primary) border-b border-(--color-border)">
      <div className="max-w-container-content mx-auto flex h-16 w-full items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold text-(--color-text-primary)">
          {logoText}
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden items-center gap-6 tablet:flex">
          {isLoggedIn ? (
            <>
              <span
                className="text-sm text-(--color-text-secondary)"
                aria-label={`로그인 사용자 ${displayName}`}
                title={displayName}
              >
                {displayName}
              </span>
              <Link
                to="/dashboard"
                className="text-sm text-(--color-text-primary) hover:text-(--color-interactive-hover)"
              >
                대시보드
              </Link>
              <Link
                to="/profile"
                className="text-sm text-(--color-text-primary) hover:text-(--color-interactive-hover)"
              >
                프로필
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded bg-(--color-interactive-default) px-4 py-2 text-sm text-(--color-system-white) hover:bg-(--color-interactive-hover) active:bg-(--color-interactive-active) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-interactive-default) focus-visible:ring-offset-2"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-(--color-text-primary) hover:text-(--color-interactive-hover)"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded bg-(--color-interactive-default) px-4 py-2 text-sm text-(--color-system-white) hover:bg-(--color-interactive-hover)"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          ref={buttonRef}
          type="button"
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="flex flex-col gap-1.5 p-2 tablet:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-interactive-default)"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span
            aria-hidden="true"
            className={`block h-0.5 w-6 bg-(--color-text-primary) transition-transform duration-200 ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            aria-hidden="true"
            className={`block h-0.5 w-6 bg-(--color-text-primary) transition-opacity duration-200 ${isMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            aria-hidden="true"
            className={`block h-0.5 w-6 bg-(--color-text-primary) transition-transform duration-200 ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div
          id={menuId}
          ref={menuRef}
          className="border-t border-(--color-border) bg-(--color-bg-primary) tablet:hidden"
        >
          <nav className="flex flex-col px-4 py-3">
            {isLoggedIn ? (
              <>
                <span className="py-2 text-sm text-(--color-text-secondary)">
                  {displayName}
                </span>
                <Link
                  ref={firstLinkRef}
                  to="/dashboard"
                  className="py-2 text-sm text-(--color-text-primary) hover:text-(--color-interactive-hover)"
                  onClick={() => setIsMenuOpen(false)}
                >
                  대시보드
                </Link>
                <Link
                  to="/profile"
                  className="py-2 text-sm text-(--color-text-primary) hover:text-(--color-interactive-hover)"
                  onClick={() => setIsMenuOpen(false)}
                >
                  프로필
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2 text-left text-sm text-(--color-interactive-default) hover:text-(--color-interactive-hover) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-interactive-default)"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  ref={firstLinkRef}
                  to="/login"
                  className="py-2 text-sm text-(--color-text-primary) hover:text-(--color-interactive-hover)"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="py-2 text-sm text-(--color-interactive-default) hover:text-(--color-interactive-hover)"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
