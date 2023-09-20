import { ILeaveWithUser } from '@/lib/types/leave';
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
import { format } from 'date-fns';

interface Props {
  leaves: ILeaveWithUser[];
}

const OnLeaveTable = ({ leaves }: Props) => {
  return (
    <Table className="m-auto my-4 w-full min-w-[600px] overflow-x-auto  rounded-sm  p-10">
      <TableCaption>A list of users on leave at the same time.</TableCaption>
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
        {leaves.map((leave) => (
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

export default OnLeaveTable;
