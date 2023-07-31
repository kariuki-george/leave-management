import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import React from 'react';
import LeavesCard from './components/leavesCard';
import RecentLeavesTable from './components/recentLeavesTable';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';

const RequestLeave = dynamic(() => import('./components/requestLeaveSheet'), {
  ssr: false,
  loading: () => <Icons.spinner />,
});

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
          <CardDescription className=" p-3 text-lg font-bold">
            <LeavesCard />
          </CardDescription>
        </Card>
        <Card className="flex w-full  max-w-[250px] items-center justify-center">
          <CardContent>
            <RequestLeave />
          </CardContent>
        </Card>
      </div>
      {/* Latest leaves */}
      <div className="my-4 w-full rounded-sm border ">
        <RecentLeavesTable />
      </div>
    </div>
  );
};

export default Dashboard;
