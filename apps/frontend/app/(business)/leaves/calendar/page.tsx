'use client';

import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import {
  getFinYears,
  getLeaveTypes,
  getUserLeaves,
  getUsers,
} from '@/lib/fetchers';
import { prepareUserLeaves } from '@/lib/helpers';
import { ILeave } from '@/lib/types/leave';
import { IUser } from '@/lib/types/user';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/state/auth.state';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';
import { ltColors } from '@/lib/helpers/colors';

const SelectUserTrigger = dynamic(
  () => import('./components/selectUserTrigger'),
  { ssr: true, loading: () => <Icons.spinner /> }
);

const Year = () => {
  const user = useAuthStore((state) => state.user);
  const [activeLeaveType, setActiveLeaveType] = useState<string>();
  const [currentUser, setCurrentUser] = useState<Partial<IUser>>();
  const [activeFinYear, setActiveFinYear] = useState<number>();

  // Set Default user
  useEffect(() => {
    setCurrentUser(user);
  }, []);

  // Get users
  const users = useQuery({
    queryFn: getUsers,
    queryKey: ['getUsers'],
  });

  // Cache colors with leaveTypes

  // Get leavetypes
  const leaveTypes = useQuery({
    queryKey: ['leaveTypes'],
    queryFn: getLeaveTypes,
  });

  const leaveTypeColor = useMemo(() => {
    const map: { [key: string]: string } = {};

    leaveTypes.data?.forEach(({ code }, index) => {
      map[code] = ltColors[index % ltColors.length];
    });
    return map;
  }, [leaveTypes]);

  // Get financial Year
  const finYears = useQuery({
    queryFn: getFinYears,
    queryKey: ['financialYears'],
    onSuccess: (data) => {
      // NOTE: In most cases, the first element will be the current finYear
      for (const index in data) {
        const finYear = data[index];
        if (finYear.status === 'CURRENT') {
          setActiveFinYear(finYear.finYearId);
          break;
        }
      }
    },
  });

  // Perform a fetch
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const data = await getUserLeaves(
        currentUser!.userId!.toString(),
        activeFinYear as number
      );
      return data.data;
    },
    queryKey: ['userLeaves', currentUser?.userId, activeFinYear],
    keepPreviousData: true,
    enabled: Boolean(currentUser && activeFinYear),
  });

  // Prepare leaves
  const cachedSummary = useMemo(() => {
    if (data) {
      return prepareUserLeaves(data as ILeave[], leaveTypes?.data ?? []);
    }
  }, [data]);

  return (
    <div className="mb-10 flex h-screen w-full  flex-col gap-3 overflow-y-auto p-3 sm:flex-row   sm:overflow-y-hidden md:p-0">
      {/* Side with user details */}
      <div className="min-w-400px flex h-full w-full flex-col border-0  sm:w-1/3 sm:border-r sm:p-3">
        {/* Select User */}
        <Select
          disabled={leaveTypes.isLoading || isLoading}
          onValueChange={(val) => {
            setCurrentUser(JSON.parse(val));
          }}
        >
          <SelectUserTrigger
            placeholder={
              leaveTypes.isLoading || isLoading ? 'Loading' : 'Select User'
            }
          />
          <SelectContent>
            {users.data &&
              users?.data.map((user: Partial<IUser>) => (
                <SelectItem value={JSON.stringify(user)} key={user?.userId}>
                  {user?.firstName + ' ' + user?.lastName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <span className="my-2" />
        <Select
          disabled={leaveTypes.isLoading || isLoading}
          onValueChange={(val) => {
            setActiveFinYear(Number(val));
          }}
        >
          <SelectUserTrigger
            placeholder={
              finYears.isLoading ? 'Loading' : 'Select Financial Year'
            }
          />
          <SelectContent>
            {finYears.data &&
              finYears?.data.map((finYear) => (
                <SelectItem
                  value={finYear.finYearId.toString()}
                  key={finYear?.finYearId}
                >
                  {new Date(finYear.startDate).getFullYear() +
                    '/' +
                    new Date(finYear.endDate).getFullYear()}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {/* User summary */}
        <section className="mt-5 flex w-full flex-col gap-3 rounded-sm border sm:border-0 ">
          <header className="border-b p-3 text-lg font-bold">Summary</header>
          <ul className="hover:bg-background flex flex-col gap-3 p-3">
            {leaveTypes.data?.map(({ code, name }, index) => (
              <li
                key={index}
                className="flex items-center justify-between hover:cursor-pointer"
                onClick={() => setActiveLeaveType(code)}
              >
                <span
                  className={cn(
                    'flex  items-center gap-2',
                    activeLeaveType === code ? 'font-bold' : 'font-semibold'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8  items-center justify-center rounded-full  font-light ',
                      leaveTypeColor[code]
                    )}
                  >
                    {code}
                  </span>
                  {name}
                </span>

                <span>{cachedSummary && cachedSummary[code].total}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Side with calendar stuff */}
      <div className="w-full rounded-sm  border p-3 sm:overflow-y-auto sm:border-0  ">
        <ul className=" flex flex-wrap justify-evenly gap-3 ">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
            <Calendar
              showOutsideDays={false}
              month={new Date(new Date().setMonth(index + 5))}
              className="dark:shadow-foreground/10 my-3 shadow  "
              cellColor={
                leaveTypeColor[activeLeaveType as string] ?? 'bg-orange-300'
              }
              key={index}
              mode="multiple"
              disableNavigation={true}
              selected={
                (activeLeaveType &&
                  cachedSummary &&
                  cachedSummary[activeLeaveType].days) ||
                []
              }
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Year;
