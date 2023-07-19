import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import RequestLeave from './components/requestLeave';

const Dashboard = () => {
  return (
    <div className="h-full w-full p-5 ">
      {/* Leaves dash */}
      <div className="flex w-full gap-3">
        {/* Total leaves */}
        <Card className="flex w-full  max-w-[250px] flex-col items-center  justify-between">
          <CardHeader className="w-full border-b text-center">
            My Leaves
          </CardHeader>
          <CardDescription className="p-3 text-lg font-bold">
            10/35
          </CardDescription>
        </Card>
        <Card className="flex w-full  max-w-[250px] items-center justify-center">
          <CardDescription>
            <RequestLeave />
          </CardDescription>
        </Card>
      </div>
      {/* Latest leaves */}
      <div className="mt-4 w-full rounded-sm border">
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
            {[1, 2, 3].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">TL</TableCell>
                <TableCell>Lorem Ipsum</TableCell>
                <TableCell>Lorem@Ipsum.com</TableCell>
                <TableCell>12/ 04/ 2020</TableCell>
                <TableCell>12/ 04/ 2020</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
