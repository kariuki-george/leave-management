'use client';

import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { leaves } from '@/lib/types/leave';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { eachDayOfInterval, format, isWeekend } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

function countWeekdays(startDate: Date, endDate: Date) {
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = allDates.filter((date) => !isWeekend(date));
  return weekdays.length;
}

const RequestLeave = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState(0);

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

  return (
    <Sheet>
      <SheetTrigger>
        <span className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          Add leave
        </span>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-3 pt-10">
        <SheetHeader>
          <SheetTitle>Add your leave</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6">
          {/* Leave Type */}
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>
            <SelectContent>
              {leaves.map((leave) => (
                <SelectItem key={leave.code} value={leave.code}>
                  {leave.name}
                </SelectItem>
              ))}
            </SelectContent>
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
                  {endDate ? (
                    format(endDate, 'PPP')
                  ) : (
                    <span>Pick an end date</span>
                  )}
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
          <Button className="w-full">Apply for {totalDays} days</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RequestLeave;
