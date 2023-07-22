'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/auth.state';
import useStore from '@/state/useStore';
import { LogOut, Settings, User } from 'lucide-react';

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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <button
          className="flex w-full items-center  text-center"
          onClick={handleLogout}
        >
          <DropdownMenuItem className="w-full justify-between hover:cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
