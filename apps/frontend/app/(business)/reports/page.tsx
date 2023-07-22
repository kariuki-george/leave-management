import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { leaves } from '@/lib/types/leaveTypes';

const Page = () => {
  return (
    <div className="flex h-full w-full justify-between ">
      {/* Router */}
      <div className="h-full w-1/5 border-r p-3 ">
        <ul className="flex flex-col gap-3">
          {leaves.map(({ code, name }) => (
            <li
              key={code}
              className="flex   items-center justify-between rounded-sm p-3 hover:cursor-pointer hover:bg-accent hover:font-semibold"
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
      </div>

      {/* Table */}
      <div className="mt-3 h-full w-3/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((_, index) => (
              <TableRow className="hover:cursor-pointer" key={index}>
                <TableCell>Lorem Ipsum</TableCell>
                <TableCell>mail@lorem.ipsum</TableCell>
                <TableCell>12/ 04/ 2020</TableCell>
                <TableCell>12/ 04/ 2020</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* More Info */}
      <div className="h-full w-1/5 border-l pt-3">
        {/* Per leave stats */}
        <section className="flex w-full flex-col border-b p-3">
          <h2 className="text-lg font-semibold ">Priviledge Leave</h2>
          <span className="my-3">Total Leaves: 40</span>
        </section>
        {/* User stats  */}
        <section className="flex flex-col gap-3 p-3">
          <span className="font-semibold ">Lorem Ipsum</span>
          <span className="font-semibold ">mail@lorem.ipsum</span>
          <span>Start Date: 12-23-2023</span>
          <span>End Date: 12-03-2023</span>
          <span>Total Days: 3</span>
        </section>
      </div>
    </div>
  );
};

export default Page;
