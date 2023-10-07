'use client';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import React, { useState } from 'react';
import UsersTable from './components/usersTable';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/lib/fetchers';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

const NewUser = dynamic(() => import('./components/newUserSheet'), {
  ssr: false,
  loading: () => <Icons.spinner />,
});

const Admin = () => {
  const [showActive, setShowActive] = useState<boolean>(true);
  const { data } = useQuery({
    queryFn: () => {
      return getAllUsers(!showActive);
    },
    queryKey: ['allUsers', showActive],
  });

  return (
    <div className="h-screen  w-full p-5 ">
      {/* Leaves dash */}
      <div className="flex w-full flex-wrap justify-center gap-3  md:justify-normal">
        {/* Total leaves */}
        <Card className="flex h-[140px] w-full min-w-[140px]  max-w-[250px] flex-col  items-center  justify-between">
          <CardHeader className="w-full border-b text-center">
            All {showActive ? 'Active' : 'Disabled'} Users
          </CardHeader>
          <CardDescription className="p-3 text-lg font-bold">
            {data?.length ?? 0}
          </CardDescription>
        </Card>
        <Card className="flex h-[140px] w-full  max-w-[250px] items-center justify-center">
          <CardDescription>
            <NewUser />
          </CardDescription>
        </Card>
        <Card className="flex h-[140px] w-full  max-w-[250px] items-center justify-center">
          {/* <CardHeader className="w-full border-b text-center">Show</CardHeader> */}
          <CardDescription className="flex gap-3 p-3 text-lg">
            <Button
              onClick={() => {
                setShowActive(true);
              }}
              variant={showActive ? 'destructive' : 'outline'}
            >
              active
            </Button>
            <Button
              onClick={() => {
                setShowActive(false);
              }}
              variant={!showActive ? 'destructive' : 'outline'}
            >
              disabled
            </Button>
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
