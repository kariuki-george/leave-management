'use client';

import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { getUserLeaves, getUsers } from '@/lib/fetchers';
import { prepareUserLeaves } from '@/lib/helpers';
import { queryClient } from '@/lib/providers/reactquery.provider';
import { ILeave } from '@/lib/types/leave';
import { IleaveTypeString, leaves } from '@/lib/types/leaveTypes';
import { IUser } from '@/lib/types/user';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/state/auth.state';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';

const SelectUserTrigger = dynamic(
  () => import('./components/selectUserTrigger'),
  { ssr: true, loading: () => <Icons.spinner /> }
);

const Year = () => {
  const user = useAuthStore((state) => state.user);
  const [activeLeaveType, setActiveLeaveType] =
    useState<IleaveTypeString>('CL');
  const [currentUser, setCurrentUser] = useState<Partial<IUser>>();

  // Set Default user
  useEffect(() => {
    setCurrentUser(user);
  }, []);

  // Get users
  const users = useQuery({
    queryFn: getUsers,
    queryKey: ['getUsers'],
  });

  // Perform a fetch
  const { data } = useQuery({
    queryFn: async () => {
      const data = await getUserLeaves(currentUser!.userId!.toString());
      return data.data;
    },
    queryKey: ['userLeaves', currentUser?.userId],
    keepPreviousData: true,
    enabled: !!currentUser,
  });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['userLeaves', currentUser] });
  }, [currentUser]);

  // Prepare leaves

  // const cachedValue = useMemo(calculateValue, dependencies);
  const cachedSummary = useMemo(() => {
    if (data) {
      return prepareUserLeaves(data as ILeave[]);
    }
  }, [data]);

  return (
    <div className="mb-10 flex h-screen w-full flex-col gap-3 overflow-y-auto  sm:flex-row sm:overflow-y-hidden">
      {/* Side with user details */}
      <div className="min-w-400px flex h-full w-full flex-col border-0 sm:w-1/3 sm:border-r sm:p-3">
        {/* Select User */}
        <Select
          onValueChange={(val) => {
            setCurrentUser(JSON.parse(val));
          }}
        >
          <SelectUserTrigger />
          <SelectContent>
            {users.data &&
              users?.data.map((user: Partial<IUser>) => (
                <SelectItem value={JSON.stringify(user)} key={user?.userId}>
                  {user?.firstName + ' ' + user?.lastName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {/* User summary */}
        <section className="mt-5 flex w-full flex-col gap-3 rounded-sm border sm:border-0 ">
          <header className="border-b p-3 text-lg font-bold">Summary</header>
          <ul className="flex flex-col gap-3 p-3 hover:bg-background">
            {leaves.map(({ code, name }, index) => (
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
                      code === 'PL' && 'bg-green-300',
                      code === 'SL' && 'bg-red-300',
                      code === 'PTL' && 'bg-purple-300',
                      code === 'CL' && 'bg-yellow-300',
                      code === 'UP' && 'bg-cyan-300',
                      code === 'ML' && 'bg-orange-300'
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
          <span className="flex justify-between p-3">
            {' '}
            Remaining Leave Days:{' '}
            <span>{currentUser?.leaveRemaining ?? 0}</span>{' '}
          </span>
        </section>
      </div>

      {/* Side with calendar stuff */}
      <div className="w-full rounded-sm  border p-3 sm:overflow-y-auto sm:border-0  ">
        <ul className=" flex flex-wrap justify-evenly gap-3 ">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
            <Calendar
              showOutsideDays={false}
              month={new Date(new Date().setMonth(index + 5))}
              className="my-3 shadow dark:shadow-foreground/10  "
              cellColor={
                activeLeaveType === 'PL'
                  ? 'bg-green-300'
                  : activeLeaveType === 'SL'
                  ? 'bg-red-300'
                  : activeLeaveType === 'PTL'
                  ? 'bg-purple-300'
                  : activeLeaveType === 'CL'
                  ? 'bg-yellow-300'
                  : activeLeaveType === 'UP'
                  ? 'bg-cyan-300'
                  : 'bg-orange-300'
              }
              key={index}
              mode="multiple"
              disableNavigation={true}
              selected={cachedSummary && cachedSummary[activeLeaveType].days}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Year;
