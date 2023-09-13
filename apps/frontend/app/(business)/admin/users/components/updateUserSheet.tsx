import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';
import { IUser } from '@/lib/types/user';

const UpdateUserForm = dynamic(() => import('./userForm'), {
  ssr: false,
  loading: () => <Icons.spinner />,
});

interface Props {
  user: IUser;
}

const UpdateUserSheet = ({ user }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>
        <span className="border-input ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          Update
        </span>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-3 pt-10">
        <SheetHeader>
          <SheetTitle>Update a new user</SheetTitle>
        </SheetHeader>
        <UpdateUserForm user={user} />
      </SheetContent>
    </Sheet>
  );
};

export default UpdateUserSheet;
