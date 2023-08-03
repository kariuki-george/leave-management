'use client';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react';
import UsersTable from './components/usersTable';
import { useQuery } from 'react-query';
import { getAllUsers } from '@/lib/fetchers';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';

const NewUser = dynamic(() => import('./components/newUserSheet'), {
  ssr: false,
  loading: () => <Icons.spinner />,
});

const Admin = () => {
  const { data } = useQuery({
    queryFn: getAllUsers,
    queryKey: ['allUsers'],
  });
  return (
    <div className="h-screen  w-full p-5 ">
      {/* Leaves dash */}
      <div className="flex w-full gap-3">
        {/* Total leaves */}
        <Card className="flex w-full  max-w-[250px] flex-col items-center  justify-between">
          <CardHeader className="w-full border-b text-center">
            All Users
          </CardHeader>
          <CardDescription className="p-3 text-lg font-bold">
            {(data?.length ?? 0) + 1}
          </CardDescription>
        </Card>
        <Card className="flex w-full  max-w-[250px] items-center justify-center">
          <CardDescription>
            <NewUser />
          </CardDescription>
        </Card>
      </div>
      {/* Latest leaves */}
      <div className="my-4  w-full overflow-auto rounded-sm border ">
        <UsersTable users={data || []} />
      </div>
    </div>
  );
};

export default Admin;
