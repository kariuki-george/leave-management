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
import { cn } from '@/lib/utils';
import { IleaveTypeString, leaves } from '@/lib/types/leaveTypes';
import { useQuery } from 'react-query';
import { getLeaves } from '@/lib/fetchers';
import { ILeaveWithUser } from '@/lib/types/leave';
import { format } from 'date-fns';

const Page = () => {
  const [activeLeaveType, setActiveLeaveType] =
    useState<IleaveTypeString>('CL');
  const [activeLeave, setActiveLeave] = useState<ILeaveWithUser>();

  const { data } = useQuery({
    queryFn: async () => {
      const data = await getLeaves(activeLeaveType);
      return data.data;
    },
    queryKey: ['leaves', activeLeaveType],
  });

  return (
    <div className="flex h-full w-full flex-col justify-normal gap-3 overflow-y-auto p-3  md:flex-row md:justify-between md:gap-0  md:overflow-hidden md:p-0">
      {/* Router */}
      <ul className="flex w-full  flex-wrap gap-3  rounded-sm border p-3 md:h-full md:w-1/5 md:flex-col md:justify-normal md:border-0  md:border-r">
        {leaves.map(({ code, name }) => (
          <li
            key={code}
            onClick={() => {
              setActiveLeave(undefined);
              setActiveLeaveType(code);
            }}
            className="hover:bg-accent flex   items-center justify-between rounded-sm  p-3 hover:cursor-pointer hover:font-semibold"
          >
            <span className="flex items-center gap-2 font-semibold">
              <span
                className={cn(
                  'flex h-8 w-8  items-center justify-center rounded-full  font-light ',
                  code === 'PL' && 'bg-green-300',
                  code === 'SL' && 'bg-red-300',
                  code === 'PTL' && 'bg-purple-300',
                  code === 'CL' && 'bg-yellow-300',
                  code === 'UP' && 'bg-cyan-300',
                  code === 'ML' && 'bg-orange-300'
                )}
              >
                {code}
              </span>
              {name}
            </span>
          </li>
        ))}
      </ul>

      {/* Table */}
      <div className="w-full min-w-[600px] rounded-sm border md:w-3/5 md:border-0">
        <Table className="h-full min-w-[600px] overflow-x-auto overflow-y-hidden  md:h-full md:w-full  md:overflow-y-auto ">
          <TableCaption>A list of leaves</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data &&
              data.map((leave: ILeaveWithUser) => (
                <TableRow
                  onClick={() => setActiveLeave(leave)}
                  key={leave.leaveId}
                  className="hover:cursor-pointer"
                >
                  <TableCell>
                    {leave.users.firstName + ' ' + leave.users.lastName}
                  </TableCell>
                  <TableCell>{leave.users.email}</TableCell>
                  <TableCell>
                    {format(new Date(leave.startDate), 'dd-L-yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(leave.startDate), 'dd-L-yyyy')}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* More Info */}
      <div className="hidden  h-full w-1/5 border-l p-3 md:flex md:flex-col">
        {/* Per leave stats */}
        <section className="flex w-full flex-col border-b p-3">
          <h2 className="text-lg font-semibold ">
            {leaves.filter((leave) => leave.code == activeLeaveType)[0].name ??
              'Casual Leave'}
          </h2>
          <span className="my-3">Total Leaves: {data?.length ?? 0}</span>
        </section>
        {/* User stats  */}
        {activeLeave && (
          <section className="flex flex-col gap-3 p-3">
            <span className="font-semibold ">
              {activeLeave?.users.firstName + ' ' + activeLeave?.users.lastName}
            </span>
            <span className="font-semibold ">{activeLeave?.users.email}</span>
            <span>
              StartDate:{' '}
              {format(new Date(activeLeave?.startDate!), 'dd-L-yyyy')}
            </span>
            <span>
              End Date: {format(new Date(activeLeave?.endDate!), 'dd-L-yyyy')}
            </span>
          </section>
        )}
      </div>
    </div>
  );
};

export default Page;
