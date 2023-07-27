'use client';

import Link from 'next/link';

import { siteConfig } from '@/config/site';

import { ThemeToggle } from '../theme-toggle';
import AuthenticatedRoutes from './auth-user-routes';
import { UserNav } from './user-nav';

const Header = () => {
  return (
    <header className="h-30 bg-background sticky top-0 z-40 flex w-full items-center justify-between border-b px-10 py-3">
      {/* Organisation */}
      <Link href={siteConfig.nav.dashboard}>
        <span className="text-xl  font-semibold">{siteConfig.name}</span>
      </Link>
      {/* User routes */}
      <span className="hidden sm:flex">
        <AuthenticatedRoutes />
      </span>
      {/* global routes and profile */}
      <div className="flex items-center justify-end gap-4">
        <nav className="flex items-center space-x-1">
          <ThemeToggle />

          <UserNav />
        </nav>
      </div>
    </header>
  );
};

export default Header;
