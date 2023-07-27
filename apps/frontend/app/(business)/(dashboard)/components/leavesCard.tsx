'use client';

import { useAuthStore } from '@/state/auth.state';
import useStore from '@/state/useStore';
import React from 'react';

const LeavesCard = () => {
  const user = useStore(useAuthStore, (state) => state.user);

  return (
    <span className="p-3 text-lg font-bold">
      {user?.leaveRemaining ?? 0} /45
    </span>
  );
};

export default LeavesCard;
