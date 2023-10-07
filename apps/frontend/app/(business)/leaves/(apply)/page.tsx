'use client';

import React, { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { addLeave, checkLeave } from '@/lib/fetchers';
import { queryClient } from '@/lib/providers/reactquery.provider';
import OnLeaveTable from './components/onLeaveTable';
import ConfigLeave from './components/config';
import { Button } from '@/components/ui/button';

const ApplyLeavePage = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Check the configuration validity
  const checkLeaveFunc = useMutation({ mutationFn: checkLeave });
  useEffect(() => {
    if (leaveType && endDate && startDate) {
      checkLeaveFunc.mutate({
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString(),
        code: leaveType,
      });
    }
  }, [leaveType, endDate, startDate]);

  // Create a leave
  const createLeaveFunc = useMutation({
    mutationFn: addLeave,
    onSuccess: () => {
      setStartDate(undefined);
      setEndDate(undefined);
      setLeaveType('');
      toast({ title: 'Added your leave successfully!' });

      // TODO: Invalidate cache
      // To get the realtime update on the year page
      queryClient.invalidateQueries(['recentLeaves']);
    },
  });

  const handleSubmit = () => {
    if (!(leaveType && startDate && endDate)) {
      toast({ variant: 'destructive', title: 'Please fill all fields' });
      return;
    }

    createLeaveFunc.mutate({
      code: leaveType,
      startDate: startDate.toDateString(),
      endDate: endDate.toDateString(),
    });
  };

  return (
    <div className="m-auto w-full max-w-[700px] p-10">
      <ConfigLeave
        endDate={endDate}
        leaveType={leaveType}
        setEndDate={setEndDate}
        setLeaveType={setLeaveType}
        setStartDate={setStartDate}
        startDate={startDate}
      />

      <div className="my-8 flex  w-full flex-col items-center justify-center gap-1 border-t"></div>

      <div className="my-4 w-full rounded-sm border ">
        <OnLeaveTable leaves={checkLeaveFunc.data?.data?.usersOnLeave ?? []} />
      </div>
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={
          !checkLeaveFunc.data?.data ||
          !checkLeaveFunc.data?.data?.allLeaveDays.length ||
          createLeaveFunc.isLoading
        }
        isLoading={createLeaveFunc.isLoading || checkLeaveFunc.isLoading}
      >
        Apply for {checkLeaveFunc.data?.data?.allLeaveDays.length ?? 0} day(s)
      </Button>
    </div>
  );
};

export default ApplyLeavePage;
