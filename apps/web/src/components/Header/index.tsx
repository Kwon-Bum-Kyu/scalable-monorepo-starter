import { Logo, SystemIcon } from "@repo/ui";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { HeaderProps } from "@/components/Header/types.ts";

// TODO: 햄버거 메뉴 오픈 시 반응형이 풀림
const Header: React.FC<HeaderProps> = ({ isLoggedIn, username }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="min-h-header-min-h px-page-x mx-auto flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="desktop:hidden flex items-center"
          aria-label="Open menu"
        >
          <SystemIcon name="bars" size={16} />
        </button>

        {/* 데스크톱 메뉴 */}
        <nav
          className="desktop:flex hidden items-center space-x-4"
          role="navigation"
        >
          {isLoggedIn ? (
            <>
              <Link to="/link1" className="hover:text-primary text-gray-700">
                Nav Link
              </Link>
              <Link to="/link2" className="hover:text-primary text-gray-700">
                Nav Link
              </Link>
              <Link to="/link3" className="hover:text-primary text-gray-700">
                Nav Link
              </Link>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <span>{username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.707a1 1 0 011.414 0L10 11.586l3.293-3.879a1 1 0 011.414 1.415l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-primary rounded px-4 py-2 text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-secondary rounded px-4 py-2 text-gray-800"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* 딤 배경 */}
      {isMenuOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* 모바일 메뉴 */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs transform bg-white shadow-lg transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-xl font-bold">logologo</h1>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="p-4" role="navigation">
          {isLoggedIn ? (
            <>
              <div className="mb-4 flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 12m-6 0a6 6 0 1012 0 6 6 0 10-12 0z"
                  />
                </svg>
                <span className="text-gray-700">{username}</span>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/link1"
                    className="hover:text-primary block text-gray-700"
                  >
                    Nav Link
                  </Link>
                </li>
                <li>
                  <Link
                    to="/link2"
                    className="hover:text-primary block text-gray-700"
                  >
                    Nav Link
                  </Link>
                </li>
                <li>
                  <Link
                    to="/link3"
                    className="hover:text-primary block text-gray-700"
                  >
                    Nav Link
                  </Link>
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/login"
                    className="bg-primary block w-full rounded px-4 py-2 text-center text-white"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-secondary block w-full rounded px-4 py-2 text-center text-gray-800"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
