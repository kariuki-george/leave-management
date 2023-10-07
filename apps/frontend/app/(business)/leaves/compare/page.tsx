'use client';
import React, { useEffect, useMemo, useState } from 'react';

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getYear,
  set,
  startOfMonth,
} from 'date-fns';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getFinYears, getLeaveTypes, getUsersLeaves } from '@/lib/fetchers';
import { FinYear } from '@/lib/types/finyear';
import { Icons } from '@/components/icons';
import LeavesView from './components/leavesView';
import { ltColors } from '@/lib/helpers/colors';

const Comparepage = () => {
  // Get and set the financial year
  const [finYear, setFinYear] = useState<FinYear>();

  const financialYears = useQuery({
    queryFn: getFinYears,
    queryKey: ['financialYears'],
  });

  // Get leaveTypes
  const { data } = useQuery({
    queryFn: getLeaveTypes,
    queryKey: ['leaveTypes'],
  });

  // Set colors

  const colors = useMemo(() => {
    const map: { [key: string]: string } = {};

    data?.forEach(({ code }, index) => {
      map[code] = ltColors[index % ltColors.length];
    });
    return map;
  }, [data]);

  // Set month to filter
  const [month, setMonth] = useState<string>();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Set start and end dates
  const [monthDates, setMonthDates] = useState<Date[]>([]);

  const setMonthDatesFunc = () => {
    if (finYear && month) {
      const activeYear =
        months.indexOf(month) > 4
          ? getYear(new Date(finYear?.startDate!))
          : getYear(new Date(finYear?.endDate!));
      const activeMonth = months.indexOf(month);

      const list = eachDayOfInterval({
        end: endOfMonth(
          set(new Date(), {
            year: activeYear,
            month: activeMonth,
          })
        ),
        start: startOfMonth(new Date(activeYear, activeMonth)),
      });

      setMonthDates(list);
      return list;
    }
  };

  useEffect(() => {
    setMonthDatesFunc();
  }, [month, finYear]);

  // Get leaves

  const getUsersLeavesFunc = useQuery({
    queryFn: async () => {
      if (month && finYear) {
        const list = setMonthDatesFunc()!;
        const data = await getUsersLeaves(
          finYear?.finYearId!,
          JSON.stringify(list[0]),
          JSON.stringify(list[list.length - 1])
        );
        return data;
      }
    },
    queryKey: ['leaves', month, finYear?.finYearId.toString()],
    enabled: Boolean(finYear && month),
  });

  return (
    <div className="flex flex-col gap-4 p-10">
      <form className="flex  flex-col gap-6 md:flex-row">
        {/* Leave Type */}
        <div className="w-[400px]">
          {' '}
          <Select
            disabled={!financialYears.data}
            onValueChange={(val) => {
              setFinYear(JSON.parse(val));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Financial Year" />
            </SelectTrigger>
            <SelectContent>
              {financialYears.data?.map((finYear) => (
                <SelectItem
                  key={finYear.finYearId}
                  value={JSON.stringify(finYear)}
                >
                  {format(new Date(finYear.startDate), 'y') +
                    '/' +
                    format(new Date(finYear.endDate), 'y')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[400px]">
          <Select
            onValueChange={(val) => {
              setMonth(val);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months?.map((month: string) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>

      {month && finYear && getUsersLeavesFunc.isLoading && (
        <div className="my-2 flex w-full flex-col items-center gap-2">
          <span>Fetching leave records</span>
          <span>
            <Icons.spinner />
          </span>
        </div>
      )}
      {getUsersLeavesFunc.data && !getUsersLeavesFunc.isLoading && (
        <LeavesView
          monthDates={monthDates}
          colors={colors}
          userLeaves={getUsersLeavesFunc.data || []}
        />
      )}
    </div>
  );
};

export default Comparepage;
