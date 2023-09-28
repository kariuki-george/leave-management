'use client';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react';
import HolidaysTable from './components/holidaysTable';
import { useQuery } from '@tanstack/react-query';
import { getOffDays } from '@/lib/fetchers';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';

const NewHoliday = dynamic(() => import('./components/newHoliday'), {
  ssr: false,
  loading: () => <Icons.spinner />,
});

const HolidaysPage = () => {
  const { data } = useQuery({
    queryFn: getOffDays,
    queryKey: ['offDays'],
  });

  return (
    <div className="h-screen  w-full p-5 ">
      {/* Holidays dash */}
      <div className="flex w-full gap-3">
        {/* Total Holidays */}
        <Card className="flex w-full  max-w-[250px] flex-col items-center  justify-between">
          <CardHeader className="w-full border-b text-center">
            All Holidays
          </CardHeader>
          <CardDescription className="p-3 text-lg font-bold">
            {data?.length ?? 0}
          </CardDescription>
        </Card>
        <Card className="flex w-full  max-w-[250px] items-center justify-center">
          <CardDescription>
            <NewHoliday />
          </CardDescription>
        </Card>
      </div>
      {/* Latest leaves */}
      <div className="my-4  w-full overflow-auto rounded-sm border ">
        <HolidaysTable holidays={data || []} />
      </div>
    </div>
  );
};

export default HolidaysPage;
