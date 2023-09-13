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
import { Button } from '@/components/ui/button';
import { ILeaveType } from '@/lib/types/leaveTypes';

const UpdateLeaveTypeForm = dynamic(() => import('./leaveTypeForm'), {
  ssr: false,
  loading: () => <Icons.spinner />,
});

interface Props {
  leaveType: ILeaveType;
}

const UpdateLeaveTypeSheet = ({ leaveType }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          isLoading={false}
          onClick={() => {}}
          className="-m-1"
          variant={'secondary'}
        >
          Update
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-3 pt-10">
        <SheetHeader>
          <SheetTitle>Update a leaveType</SheetTitle>
        </SheetHeader>
        <UpdateLeaveTypeForm leaveType={leaveType} />
      </SheetContent>
    </Sheet>
  );
};

export default UpdateLeaveTypeSheet;
