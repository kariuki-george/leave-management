'use client';

import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { leaves } from '@/lib/types/leave';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

const list = {
  remainingDays: 3,
};

const Year = () => {
  const [active, setActive] = useState('CL');
  return (
    <div className="flex h-screen w-full">
      {/* Side with user details */}
      <div className="min-w-400px flex h-full w-1/3  flex-col border-r p-3">
        {/* Select User */}
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">John Doe</SelectItem>
            <SelectItem value="dark">Lorem Ipsum</SelectItem>
            <SelectItem value="system">Dolor Sit Amet</SelectItem>
          </SelectContent>
        </Select>
        {/* User summary */}
        <section className="mt-5 flex w-full flex-col gap-3">
          <header className="border-b p-3 text-lg font-bold">Summary</header>
          <ul className="flex flex-col gap-3 p-3 hover:bg-background">
            {leaves.map(({ code, name }, index) => (
              <li
                key={index}
                className="flex items-center justify-between hover:cursor-pointer"
                onClick={() => setActive(code)}
              >
                <span
                  className={cn(
                    'flex  items-center gap-2',
                    active === code ? 'font-bold' : 'font-semibold'
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

                <span>{6}</span>
              </li>
            ))}
          </ul>
          <span className="flex justify-between p-3">
            {' '}
            Remaining Leave Days: <span>{list.remainingDays}</span>{' '}
          </span>
        </section>
      </div>

      {/* Side with calendar stuff */}
      <div className="w-full overflow-y-auto p-3 ">
        <ul className="mb-32 flex flex-wrap justify-evenly gap-3 ">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
            <Calendar
              month={new Date(new Date().setMonth(index + 5))}
              className="my-3 shadow  "
              cellColor={
                active === 'PL'
                  ? 'bg-green-300'
                  : active === 'SL'
                  ? 'bg-red-300'
                  : active === 'PTL'
                  ? 'bg-purple-300'
                  : active === 'CL'
                  ? 'bg-yellow-300'
                  : active === 'UP'
                  ? 'bg-cyan-300'
                  : 'bg-orange-300'
                // active === 'ML' ? 'bg-orange-300'
              }
              key={index}
              mode="multiple"
              disableNavigation={true}
              selected={[
                new Date(),
                new Date(2023, 1, 22),
                new Date(2023, 1, 23),
                new Date(2023, 3, 22),
                new Date(2023, 3, 23),
                new Date(2023, 7, 22),
                new Date(2023, 7, 23),
              ]}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Year;
