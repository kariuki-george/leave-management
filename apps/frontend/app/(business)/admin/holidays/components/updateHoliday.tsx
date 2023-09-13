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
import { IOffDay } from '@/lib/types/offDays';
import { Button } from '@/components/ui/button';

const UpdateHolidayForm = dynamic(() => import('./holiday'), {
  ssr: false,
  loading: () => <Icons.spinner />,
});

interface Props {
  offDay: IOffDay;
}

const UpdateHolidaySheet = ({ offDay }: Props) => {
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
          <SheetTitle>Update a holiday</SheetTitle>
        </SheetHeader>
        <UpdateHolidayForm offDay={offDay} />
      </SheetContent>
    </Sheet>
  );
};

export default UpdateHolidaySheet;
