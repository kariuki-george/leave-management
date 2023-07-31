'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { siteConfig } from '@/config/site';

import { useAuthStore } from '../../state/auth.state';

interface IProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: IProps) => {
  const router = useRouter();

  // Check if user exists
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push(siteConfig.nav.home + '?redirect=' + location.pathname);
    }
  }, [user, router]);

  return <>{children}</>;
};

export default AuthProvider;
