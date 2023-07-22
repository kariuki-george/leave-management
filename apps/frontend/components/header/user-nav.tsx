'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/auth.state';
import useStore from '@/state/useStore';
import { BarChart4, Calendar, Home, LogOut, Settings } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function UserNav() {
  const state = useStore(useAuthStore, (state) => state);
  const router = useRouter();
  const handleLogout = () => {
    sessionStorage.clear();
    state?.clear();

    router.replace(siteConfig.nav.auth.login);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {state?.user
                ? state.user.firstName[0] + state.user.lastName[0]
                : ''}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {state?.user?.firstName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {state?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={siteConfig.nav.dashboard}>
            <DropdownMenuItem>
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>
          <Link href={siteConfig.nav.year}>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>My Year</span>
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>
          <Link href={siteConfig.nav.reports}>
            <DropdownMenuItem>
              <BarChart4 className="mr-2 h-4 w-4" />
              <span>Reports</span>
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <button
          className="flex w-full items-center  text-center"
          onClick={handleLogout}
        >
          <DropdownMenuItem className="w-full  hover:cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
            {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
