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
import { IUser } from '@/lib/types/user';
import { useMutation } from 'react-query';
import { adminUpdateUser } from '@/lib/fetchers';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from '@/lib/providers/reactquery.provider';
import { useAuthStore } from '@/state/auth.state';
import { IOffDay } from '@/lib/types/offDays';
import { format } from 'date-fns';

interface Props {
  holidays: IOffDay[];
}

const HolidaysTable = ({ holidays }: Props) => {
  const currentUser = useAuthStore((state) => state.user);
  // Update user
  const [userId, setUserId] = useState(0);
  const { isLoading, mutate } = useMutation({
    mutationFn: adminUpdateUser,
    onSuccess: () => {
      toast({ title: 'Updated user successfully!' });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setUserId(0);
    },
  });
  const handleDisabled = (userId: number, toDisable: boolean) => {
    mutate({ userId, disabled: toDisable });
  };
  const handleIsAdmin = (userId: number, isAdmin: boolean) => {
    mutate({ userId, isAdmin });
    setUserId(userId);
  };

  return (
    <Table className="mb-4 w-full min-w-[600px] overflow-x-auto">
      <TableCaption>A list of all holidays.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date - yyyy-mm-dd</TableHead>

          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holidays?.map(({ date, name, offDayId }) => (
          <TableRow key={offDayId}>
            <TableCell className="font-medium">{name}</TableCell>
            <TableCell>{format(new Date(date), 'yyyy-MM-dd')}</TableCell>

            <TableCell>
              {/* {user.disabled ? (
                <Button
                  isLoading={isLoading && user.userId === userId}
                  onClick={() => {
                    handleDisabled(user?.userId!, false);
                  }}
                  className="-m-1"
                  variant={'outline'}
                >
                  enable
                </Button>
              ) : (
                <span className="flex gap-3">
                  {user.isAdmin ? (
                    <Button
                      isLoading={isLoading && user.userId === userId}
                      onClick={() => {
                        handleIsAdmin(user?.userId!, false);
                      }}
                      className="-m-1"
                      variant={'secondary'}
                    >
                      Revoke admin
                    </Button>
                  ) : (
                    <Button
                      isLoading={isLoading && user.userId === userId}
                      onClick={() => {
                        handleIsAdmin(user?.userId!, true);
                      }}
                      className="-m-1"
                      variant={'secondary'}
                    >
                      Become admin
                    </Button>
                  )}
                  <Button
                    isLoading={isLoading && user.userId === userId}
                    onClick={() => {
                      handleDisabled(user?.userId!, true);
                    }}
                    className="-m-1"
                    variant={'destructive'}
                  >
                    disable
                  </Button>
                </span>
              )} */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HolidaysTable;
