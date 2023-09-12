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
import { cn } from '@/lib/utils';

interface Props {
  users: IUser[];
}

const RecentLeavesTable = ({ users }: Props) => {
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
      <TableCaption>A list of all employees.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Employee Id</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user: Partial<IUser>) => (
          <TableRow key={user.userId}>
            <TableCell className="font-medium">{user.userId!}</TableCell>
            <TableCell>{user.firstName}</TableCell>

            <TableCell>{user.lastName}</TableCell>
            <TableCell>{user.email ?? 'Not set yet'}</TableCell>
            <TableCell
              className={cn(
                currentUser?.userId === user.userId ? 'hidden' : 'flex'
              )}
            >
              {user.disabled ? (
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
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentLeavesTable;
