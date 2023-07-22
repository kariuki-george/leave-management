'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from 'react-query';
import { getRecentLeaves } from '@/lib/fetchers';
import { ILeaveWithUser } from '@/lib/types/leave';
import { format } from 'date-fns';

const RecentLeavesTable = () => {
  const { data } = useQuery({
    queryFn: getRecentLeaves,
    queryKey: ['recentLeaves'],
  });

  return (
    <Table>
      <TableCaption>A list of some recent leaves.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Leave Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data.map((leave: ILeaveWithUser) => (
          <TableRow key={leave.leaveId}>
            <TableCell className="font-medium">
              {leave.leaveTypes.code}
            </TableCell>
            <TableCell>{leave.users.firstName}</TableCell>
            <TableCell>{leave.users.email}</TableCell>
            <TableCell>
              {format(new Date(leave.startDate), 'dd-L-yyyy')}
            </TableCell>
            <TableCell>
              {' '}
              {format(new Date(leave.endDate), 'dd-L-yyyy')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentLeavesTable;
