'use client';

import React, { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { addLeave } from '@/lib/fetchers';
import { useAuthStore } from '@/state/auth.state';
import { countWeekdays } from '@/lib/helpers';
import { queryClient } from '@/lib/providers/reactquery.provider';

const RequestLeaveForm = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState(0);
  const [leaveType, setLeaveType] = useState('');

  const validateDates = (date: Date, input: 'START' | 'END') => {
    if (input === 'START') {
      if (date < new Date()) {
        toast({
          variant: 'destructive',
          title: 'Start Date must be from tomorrow onwards',
        });
        return;
      }
      if (endDate && date > endDate) {
        toast({
          variant: 'destructive',
          title: 'End date should be greater than start Date',
        });
        return;
      }
      setStartDate(date);
    }
    if (input === 'END') {
      if (!startDate) {
        toast({
          variant: 'destructive',
          title: 'Start Date must be set first',
        });
        return;
      }

      if (date < startDate!) {
        toast({
          variant: 'destructive',
          title: 'End date should be greater than start Date',
        });
        return;
      }

      setEndDate(date);
    }
  };

  useEffect(() => {
    if (endDate && startDate) {
      setTotalDays(countWeekdays(startDate, endDate));
    }
  }, [startDate, endDate]);

  // Handle submit
  const { user } = useAuthStore((state) => state);
  const { isLoading, mutate } = useMutation({
    mutationFn: addLeave,
    onSuccess: () => {
      toast({ title: 'Added your leave successfully!' });

      // To get the realtime update on the year page
      queryClient.invalidateQueries(['userLeaves', user?.userId]);
      queryClient.invalidateQueries(['recentLeaves']);
      queryClient.invalidateQueries(['getUsers']);
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!(leaveType && startDate && endDate)) {
      toast({ variant: 'destructive', title: 'Please fill all fields' });
      return;
    }
    if (totalDays === 0) {
      toast({
        variant: 'destructive',
        title: 'Total number of days should be greater than 0',
      });
      return;
    }

    mutate({
      totalDays,
      code: leaveType,
      startDate: startDate.toDateString(),
      endDate: endDate.toDateString(),
    });
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Leave Type */}
      <Select onValueChange={setLeaveType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Leave Type" />
        </SelectTrigger>
        <SelectContent></SelectContent>
      </Select>

      {/* Start Date */}
      <div className={cn('flex w-full gap-2')}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, 'PPP')
              ) : (
                <span className="w-full">Pick a start Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                validateDates(date as Date, 'START');
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* End Date */}
      <div className={cn('grid gap-2')}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !endDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, 'PPP') : <span>Pick an end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                validateDates(date as Date, 'END');
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Apply for {totalDays} days
      </Button>
    </form>
  );
};

export default RequestLeaveForm;
