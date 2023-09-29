'use client';
import React from 'react';

import { addMonths, format } from 'date-fns';
import { cn } from '@/lib/utils';

import { IUserLeave } from '@/lib/types/leave';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  userLeaves: IUserLeave[];
  monthDates: Date[];
}

const LeavesView = ({ userLeaves, monthDates }: Props) => {
  console.log('rendered');
  return (
    <div className="flex w-full overflow-x-auto  ">
      <div className="  flex w-[200px] min-w-[200px] flex-col rounded-l-sm  border  ">
        <span className={cn('h-[50px] border-b p-2')}>Name</span>
        {userLeaves?.map(({ user }, index) => (
          <span className={cn('h-[40px] border-b p-2')} key={index}>
            {user?.firstName + ' ' + user?.lastName}
          </span>
        ))}
      </div>
      <div className=" flex w-full min-w-[600px] flex-col  overflow-x-auto border-t">
        <ul className={cn('flex h-[50px] w-full min-w-[600px] flex-row  ')}>
          {monthDates.map((date, index) => (
            <div
              key={index}
              className="flex h-[50px] w-[60px] flex-col items-center justify-center border-b border-l text-center  "
            >
              <span className=" w-[60px]">{new Date(date).getDate()}</span>
              <span className=" w-[60px]">{format(date, 'EEE')}</span>
            </div>
          ))}
        </ul>
        {userLeaves?.map(({ leaves }, index) => (
          <ul
            className={cn('flex h-[40px] w-full min-w-[600px] flex-row   ')}
            key={index}
          >
            {monthDates.map((date, index) => {
              // Mismatch between server and client month numbers
              // Server: 1-12
              // client: 0-11

              const presentHoliday =
                leaves[format(addMonths(date, 0), 'MM/dd/yyyy')];
              console.log(date, 'cal');
              console.log(leaves, 'leaves');
              console.log(
                format(addMonths(date, 0), 'MM/dd/yyyy'),
                'formatted calendar'
              );
              console.log(Boolean(presentHoliday));
              return (
                <div
                  key={index}
                  className=" flex h-[40px] w-[60px]  items-center justify-center border-b border-l  "
                >
                  <span
                    className={cn(
                      'flex h-full w-[60px] items-center justify-center',
                      ''
                    )}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          className={cn(
                            'h-6 w-6 rounded-full',
                            presentHoliday && 'bg-green-200'
                          )}
                        ></TooltipTrigger>
                        <TooltipContent>
                          <p>{presentHoliday?.name ?? ''}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                </div>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default LeavesView;
