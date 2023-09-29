'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { updateOffDay } from '@/lib/fetchers';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from '@/lib/providers/reactquery.provider';
import { IOffDay } from '@/lib/types/offDays';
import { format } from 'date-fns';
import UpdateLeaveTypeSheet from './updateHoliday';

interface Props {
  holidays: IOffDay[];
}

const HolidaysTable = ({ holidays }: Props) => {
  // Update holiday
  const [currentOffDayId, setOffDayId] = useState(0);
  const { isLoading, mutate } = useMutation({
    mutationFn: updateOffDay,
    onSuccess: () => {
      setOffDayId(0);
      queryClient.invalidateQueries({ queryKey: ['offDays'] });
      toast({ title: 'Updated holiday successfully' });
    },
  });
  const handleDisabled = (offDayId: number, toDisable: boolean) => {
    mutate({ offDayId, disabled: toDisable });
  };

  return (
    <Table className="mb-4 w-full min-w-[600px] overflow-x-auto">
      <TableCaption>A list of all holidays.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>yyyy-mm-dd</TableHead>
          <TableHead>Recurring</TableHead>

          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holidays?.map(
          ({ date, name, offDayId, createdAt, disabled, recurring }) => (
            <TableRow key={offDayId}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{format(new Date(date), 'yyyy-MM-dd')}</TableCell>
              <TableCell>{recurring ? 'YES' : 'NO'}</TableCell>

              <TableCell>
                {disabled ? (
                  <Button
                    isLoading={isLoading && offDayId === currentOffDayId}
                    onClick={() => {
                      setOffDayId(offDayId);
                      handleDisabled(offDayId, false);
                    }}
                    className="-m-1"
                    variant={'destructive'}
                  >
                    Enable
                  </Button>
                ) : (
                  <span className="flex gap-3">
                    <UpdateLeaveTypeSheet
                      offDay={{
                        createdAt,
                        date,
                        name,
                        offDayId,
                        disabled,
                        recurring,
                      }}
                    />
                    <Button
                      isLoading={isLoading && offDayId === currentOffDayId}
                      onClick={() => {
                        setOffDayId(offDayId);

                        handleDisabled(offDayId, true);
                      }}
                      className="-m-1"
                      variant={'destructive'}
                    >
                      Disable
                    </Button>{' '}
                  </span>
                )}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};

export default HolidaysTable;
