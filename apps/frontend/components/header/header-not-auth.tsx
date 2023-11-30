import Link from 'next/link';

import { siteConfig } from '@/config/site';

import { ThemeToggle } from '../theme-toggle';

const Header = () => {
  return (
    <header className="h-30 bg-background sticky top-0 z-40 flex w-full justify-between border-b px-10 py-3">
      {/* Organisation */}
      <span>
        <Link href={siteConfig.nav.landing}>
          <span className=" flex h-full items-center text-lg font-bold">
            {siteConfig.name}
          </span>
        </Link>
      </span>

      {/* global routes and profile */}
      <div className="flex items-center justify-end gap-4">
        <Link href={siteConfig.nav.status} target="_blank">
          <span className=" flex h-full items-center font-semibold  ">
            Status
          </span>
        </Link>
        <nav className="flex items-center space-x-1">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
