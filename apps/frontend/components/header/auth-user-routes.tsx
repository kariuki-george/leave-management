'use client';

import * as React from 'react';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useAuthStore } from '@/state/auth.state';
import useStore from '@/state/useStore';
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from '@radix-ui/react-navigation-menu';
import {
  Bed,
  Calendar,
  Cog,
  GitCompare,
  PlusCircleIcon,
  PrinterIcon,
  Timer,
  User,
} from 'lucide-react';

interface NavProps {
  title: string;
  href: string;
  description: string;
  Icon: React.ReactNode;
}

export const leaveRoutes: NavProps[] = [
  {
    title: 'Calendar',
    href: siteConfig.nav.leaves.calendar,
    description: 'View leaves in a calendar view.',
    Icon: <Calendar className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Compare',
    href: siteConfig.nav.leaves.compare,
    description: 'Compare leaves against other users in an excel-like view.',
    Icon: <GitCompare className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Print',
    href: siteConfig.nav.leaves.print,
    description: 'Turn leave data into printable format.',
    Icon: <PrinterIcon className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Apply',
    href: siteConfig.nav.leaves.apply,
    description: 'Apply for a loan.',
    Icon: <PlusCircleIcon className="mr-2 h-4 w-4" />,
  },
];
export const adminRoutes: NavProps[] = [
  {
    title: 'Users',
    href: siteConfig.nav.admin.users,
    description: 'Create, Update and Disable Users.',
    Icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Financial Year',
    href: siteConfig.nav.admin.finyear,
    description: 'List previous and Check current Financial Year.',
    Icon: <Timer className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Holidays',
    href: siteConfig.nav.admin.holidays,
    description: 'Create, Update and Disable Holidays.',
    Icon: <Bed className="mr-2 h-4 w-4" />,
  },
  {
    title: 'Leave Types',
    href: siteConfig.nav.admin.leavetypes,
    description: 'Create, Update and Delete LeaveTypes.',
    Icon: <Cog className="mr-2 h-4 w-4" />,
  },
];

const AuthenticatedRoutes = () => {
  const user = useStore(useAuthStore, (state) => state.user);

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-3">
        <NavigationMenuItem>
          <Link href={siteConfig.nav.dashboard} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
            Leaves
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-fit">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {leaveRoutes.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {user?.isAdmin && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
              Admin
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-fit">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {adminRoutes.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default AuthenticatedRoutes;
