'use client';

import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
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
import { format, startOfTomorrow } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getLeaveTypes } from '@/lib/fetchers';

interface Props {
  startDate?: Date;
  endDate?: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  leaveType: string;
  setLeaveType: (code: string) => void;
}

const ConfigLeave = ({
  endDate,
  setEndDate,
  setLeaveType,
  setStartDate,
  startDate,
}: Props) => {
  const { data } = useQuery({
    queryFn: getLeaveTypes,
    queryKey: ['leaveTypes'],
  });

  const validateDates = (date: Date, input: 'START' | 'END') => {
    if (input === 'START') {
      if (date < startOfTomorrow()) {
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

      setEndDate(date);
    }
  };

  return (
    <form className="flex flex-col gap-6">
      {/* Leave Type */}
      <Select disabled={!data} onValueChange={setLeaveType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Leave Type" />
        </SelectTrigger>
        <SelectContent>
          {data?.map((leave) => (
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
              {endDate ? format(endDate, 'PPP') : <span>Pick an end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              fromDate={startDate}
              onSelect={(date) => {
                validateDates(date as Date, 'END');
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </form>
  );
};

export default ConfigLeave;
