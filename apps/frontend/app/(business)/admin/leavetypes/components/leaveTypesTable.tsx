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
import { updateLeaveType } from '@/lib/fetchers';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from '@/lib/providers/reactquery.provider';
import { ILeaveType } from '@/lib/types/leaveTypes';
import UpdateLeaveTypeSheet from './updateLeaveType';

interface Props {
  leaveTypes: ILeaveType[];
}

const LeaveTypes = ({ leaveTypes }: Props) => {
  // Update leaveType
  const [currentLeaveTypeCode, setLeaveTypeCode] = useState('');
  const { isLoading, mutate } = useMutation({
    mutationFn: updateLeaveType,
    onSuccess: () => {
      setLeaveTypeCode('');
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
      toast({ title: 'Updated leaveType successfully' });
    },
  });
  const handleDisabled = (code: string, toDisable: boolean) => {
    mutate({ code, disabled: toDisable });
  };
  return (
    <Table className="mb-4 w-full min-w-[600px] overflow-x-auto">
      <TableCaption>A list of all leaveTypes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Max Days</TableHead>
          <TableHead>Annual Leave Based</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaveTypes?.map(
          ({ code, maxDays, name, isAnnualLeaveBased, disabled }) => (
            <TableRow key={code}>
              <TableCell className="font-medium">{code}</TableCell>
              <TableCell>{name}</TableCell>

              <TableCell>{isAnnualLeaveBased ? 45 : maxDays}</TableCell>
              <TableCell>{isAnnualLeaveBased ? 'YES' : 'NO'}</TableCell>
              <TableCell>
                {disabled ? (
                  <Button
                    isLoading={isLoading && code === currentLeaveTypeCode}
                    onClick={() => {
                      setLeaveTypeCode(code);
                      handleDisabled(code, false);
                    }}
                    className="-m-1"
                    variant={'destructive'}
                  >
                    Enable
                  </Button>
                ) : (
                  <span className="flex gap-3">
                    <UpdateLeaveTypeSheet
                      leaveType={{
                        code,
                        disabled,
                        isAnnualLeaveBased,
                        maxDays,
                        name,
                      }}
                    />
                    <Button
                      isLoading={isLoading && code === currentLeaveTypeCode}
                      onClick={() => {
                        setLeaveTypeCode(code);
                        handleDisabled(code, true);
                      }}
                      className="-m-1"
                      variant={'destructive'}
                    >
                      Disable
                    </Button>
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

export default LeaveTypes;
