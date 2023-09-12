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

const NewLeaveTypeForm = dynamic(() => import('./leaveTypeForm'), {
  ssr: false,
  loading: () => <Icons.spinner />,
});

const NewLeaveTypeSheet = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <span className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          New LeaveType
        </span>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-3 pt-10">
        <SheetHeader>
          <SheetTitle>Create a new leave type</SheetTitle>
        </SheetHeader>
        <NewLeaveTypeForm />
      </SheetContent>
    </Sheet>
  );
};

export default NewLeaveTypeSheet;
