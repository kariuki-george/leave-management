'use client';

import { Icons } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { getMasterData } from '@/lib/fetchers';
import { queryClient } from '@/lib/providers/reactquery.provider';
import { MasterData } from '@/lib/types/master';
import { useAuthStore } from '@/state/auth.state';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const Home = () => {
  // If a user exists, redirect to a redirect else dashboard
  // If no user, try making a request to retrieve user
  // If auth errors on request, redirect to landing

  const router = useRouter();
  const { user, setUser } = useAuthStore((state) => state);
  const searchParams = useSearchParams();
  const search = searchParams.get('redirect');

  const handleRedirect = () => {
    if (search) {
      router.replace(search);
    } else {
      router.replace(siteConfig.nav.dashboard);
    }
  };
  const handleGetMasterData = async () => {
    const { user, leaveTypes, leaveBalances }: MasterData =
      await getMasterData();
    setUser(user);

    queryClient.setQueryData(['leaveTypes'], leaveTypes);

    queryClient.setQueryData(['leaveBalances'], leaveBalances);

    handleRedirect();
  };

  useEffect(() => {
    if (user) {
      handleRedirect();
    } else {
      try {
        handleGetMasterData();
      } catch (error) {
        router.replace(siteConfig.nav.landing);
      }
    }
  }, []);

  return (
    <div className="flex h-full min-h-[600px] w-full flex-col items-center justify-center gap-3">
      <Icons.spinner />
      <span>fetching your details, just a sec...</span>
    </div>
  );
};

export default Home;
