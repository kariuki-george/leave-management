'use client';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react';
import FinYearsTable from './components/finYearsTable';
import { useQuery } from 'react-query';
import { getFinYears } from '@/lib/fetchers';

const FinYear = () => {
  const { data } = useQuery({
    queryFn: getFinYears,
    queryKey: ['financialYears'],
  });

  return (
    <div className="h-screen  w-full p-5 ">
      {/* Leaves dash */}
      <div className="flex w-full gap-3">
        {/* Total leaves */}
        <Card className="flex w-full  max-w-[250px] flex-col items-center  justify-between">
          <CardHeader className="w-full border-b text-center">
            All Financial Years
          </CardHeader>
          <CardDescription className="p-3 text-lg font-bold">
            {data?.length ?? 0}
          </CardDescription>
        </Card>
      </div>
      {/* Latest leaves */}
      <div className="my-4  w-full overflow-auto rounded-sm border ">
        <FinYearsTable finYears={data || []} />
      </div>
    </div>
  );
};

export default FinYear;
