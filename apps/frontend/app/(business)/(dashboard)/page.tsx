import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react';
import RequestLeave from './components/requestLeaveSheet';
import LeavesCard from './components/leavesCard';
import RecentLeavesTable from './components/recentLeavesTable';

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
            <LeavesCard />
          </CardDescription>
        </Card>
        <Card className="flex w-full  max-w-[250px] items-center justify-center">
          <CardDescription>
            <RequestLeave />
          </CardDescription>
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
