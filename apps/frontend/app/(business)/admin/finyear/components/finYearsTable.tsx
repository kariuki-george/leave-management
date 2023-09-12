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

import { FinYear } from '@/lib/types/finyear';
import { format } from 'date-fns';

interface Props {
  finYears: FinYear[];
}

const FinYearsTable = ({ finYears }: Props) => {
  return (
    <Table className="mb-4 w-full min-w-[600px] overflow-x-auto">
      <TableCaption>A list of all finYears.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created By</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {finYears?.map(({ author, endDate, startDate, status, finYearId }) => (
          <TableRow key={finYearId}>
            <TableCell>{format(new Date(startDate), 'yyyy-MM-dd')}</TableCell>

            <TableCell>{format(new Date(endDate), 'yyyy-MM-dd')}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{author}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FinYearsTable;
