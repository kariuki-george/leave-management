import React from 'react';
import LeavesCards from './components/leavesCards';
import RecentLeavesTable from './components/recentLeavesTable';


const Dashboard = () => {
  return (
    <div className="h-full w-full p-5 ">
      {/* Leaves dash */}
      <LeavesCards />

      {/* Latest leaves */}
      <div className="my-4 w-full rounded-sm border ">
        <RecentLeavesTable />
      </div>
    </div>
  );
};

export default Dashboard;
