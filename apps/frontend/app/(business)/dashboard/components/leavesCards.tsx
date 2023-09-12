'use client';

import { getLeaveBalances } from '@/lib/fetchers';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { useQuery } from 'react-query';
import LeaveCard from './leaveCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

const LeavesCard = () => {
  const { data } = useQuery({
    queryFn: getLeaveBalances,
    queryKey: 'leaveBalances',
  });

  return (
    <div className="flex w-full flex-wrap gap-3">
      {/* Total leaves */}
      <LeaveCard
        remainingDays={data?.annualLeaveBalance.remainingDays ?? 0}
        maxDays={45}
        name="Annual Leave Days"
      />

      {data?.leaveBalances.map((leaveBalance) => (
        <LeaveCard
          key={leaveBalance.leaveTypeCode}
          remainingDays={leaveBalance.remainingDays ?? 0}
          maxDays={leaveBalance.leaveTypes.maxDays ?? 0}
          name={leaveBalance.leaveTypes.name}
        />
      ))}

      <Card className="flex w-full  max-w-[250px] items-center justify-center">
        <CardContent>
          <Link href={siteConfig.nav.leaves.apply}>
            <Button variant={'outline'}>Add leave</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeavesCard;
