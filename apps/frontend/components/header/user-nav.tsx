'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/auth.state';
import useStore from '@/state/useStore';
import {
  BarChart4,
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react';

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
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/lib/fetchers';
import { toast } from '../ui/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { adminRoutes, leaveRoutes } from './auth-user-routes';

export function UserNav() {
  const state = useStore(useAuthStore, (state) => state);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      sessionStorage.clear();
      state?.clear();
      router.replace(siteConfig.nav.auth.login);
    },
  });

  const handleLogout = () => {
    mutate();
    toast({ title: 'Will log you out shortly' });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="dropdownbutton"
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
        >
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
            <p className="text-muted-foreground text-xs leading-none">
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

          <Collapsible className="w-full">
            <CollapsibleTrigger className=" w-full">
              <span className="  focus:bg-accent  focus:text-accent-foreground relative flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:cursor-pointer data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <span className="flex">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  <span>Leaves</span>
                </span>

                <ChevronDown className="mr-2 h-4 w-4" />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-background flex w-full flex-col items-end  ">
              {leaveRoutes.map((leaveRoute, index) => (
                <Link key={index} href={leaveRoute.href} className=" w-[90%]  ">
                  <DropdownMenuItem key={index} className=" w-[90%]  ">
                    {leaveRoute.Icon}
                    <span>{leaveRoute.title}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {state?.user?.isAdmin && (
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full">
                <span className="  focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:cursor-pointer data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <span className="flex">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </span>

                  <ChevronDown className="mr-2 h-4 w-4" />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-background flex w-full flex-col items-end ">
                {adminRoutes.map((adminRoute, index) => (
                  <Link
                    key={index}
                    href={adminRoute.href}
                    className=" w-[90%]  "
                  >
                    <DropdownMenuItem key={index} className=" w-[90%]  ">
                      {adminRoute.Icon}
                      <span>{adminRoute.title}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
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
