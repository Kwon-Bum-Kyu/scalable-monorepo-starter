import { Link, Logo, SystemIcon, type SystemIconName,Typography } from "@repo/ui";

const icons: { to: string; iconName: SystemIconName }[] = [
  {
    iconName: "linkedin",
    to: "https://www.linkedin.com/in/bumkyu98/",
  },
  {
    iconName: "github",
    to: "https://github.com/Kwon-Bum-Kyu",
  },
  {
    iconName: "envelope-outline",
    to: "mailto:missing107@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-400 bg-white text-gray-800">
      <div className="w-full px-4 py-10 md:py-12">
        <div className="mx-auto grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-8 px-4 md:grid-cols-5">
          {/* Left Logo and Icons */}
          <div className="md:col-span-1">
            <Logo />
            <div className="mb-6 mt-6 flex space-x-4">
              {icons.map((icon) => (
                <Link
                  key={icon.iconName}
                  to={icon.to}
                  aria-label={`${icon.iconName.replace("-outline", "")} 페이지로 이동`}
                >
                  <SystemIcon
                    name={icon.iconName}
                    size={20}
                    className="text-gray-400"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:col-span-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((col) => (
              <div key={col} className="space-y-2">
                <Link to="/">
                  <Typography variant="h5" className="mb-2 text-gray-400">
                    Title
                  </Typography>
                </Link>

                <ul className="space-y-1">
                  <li>
                    <Link to="#" className="text-gray-400">
                      Nav Link
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400">
                      Nav Link
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="text-gray-400">
                      Nav Link
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mx-auto mt-10 w-full justify-end border-t border-gray-200 px-4 pt-4 text-sm text-gray-500 md:px-10 md:pt-6">
          <span className="block text-right">© DEV KBK 2025</span>
        </div>
      </div>
    </footer>
  );
}
