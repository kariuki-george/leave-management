'use client';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import React from 'react';

interface Props {
  maxDays: number;
  remainingDays: number;
  name: string;
}

const LeaveCard = ({ maxDays, name, remainingDays }: Props) => {
  return (
    <Card className="flex h-[140px] w-full  max-w-[250px] flex-col items-center  justify-between">
      <CardHeader className="w-full border-b text-center">{name}</CardHeader>
      <CardDescription className=" p-3 text-lg font-bold">
        <span className="p-3 text-lg font-bold">
          {remainingDays} /{maxDays}
        </span>
      </CardDescription>
    </Card>
  );
};

export default LeaveCard;
