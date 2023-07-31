import Link from 'next/link';

import { siteConfig } from '@/config/site';

import { ThemeToggle } from '../theme-toggle';

const Header = () => {
  return (
    <header className="h-30 sticky top-0 z-40 flex w-full justify-between border-b bg-background px-10 py-3">
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
        <nav className="flex items-center space-x-1">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
