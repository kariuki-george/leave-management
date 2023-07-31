'use client';

import { Icons } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { getMe } from '@/lib/fetchers';
import { useAuthStore } from '@/state/auth.state';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const Home = () => {
  // If a user exists, redirect to a redirect else dashboard
  // If no user and dev server, redirect to landing
  // If on a prod server, try making a request to retrieve user
  // If auth errors on request, redirect to landing

  const router = useRouter();
  const { user, setUser } = useAuthStore((state) => state);
  const isDev = process.env.NODE_ENV === 'development';
  const searchParams = useSearchParams();
  const search = searchParams.get('redirect');

  const handleRedirect = () => {
    if (search) {
      router.replace(search);
    } else {
      router.replace(siteConfig.nav.dashboard);
    }
  };
  const handleGetUser = async () => {
    const user = await getMe();
    setUser(user);
    handleRedirect();
  };

  useEffect(() => {
    if (!user) {
      if (isDev) {
        router.replace(siteConfig.nav.landing);
        return;
      } else {
        handleGetUser();
      }
    } else {
      handleRedirect();
    }
  }, []);

  return (
    <div className="flex h-full min-h-[600px] w-full items-center justify-center">
      <Icons.spinner />
    </div>
  );
};

export default Home;
