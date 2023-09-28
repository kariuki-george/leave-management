import { getLeaveTypes } from '@/lib/fetchers';
import { IUserLeave } from '@/lib/types/leave';
import { cn } from '@/lib/utils';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Props {
  data: IUserLeave[];
}

const LeaveTotals = ({ data }: Props) => {
  const leaveTypesFunc = useQuery({
    queryFn: getLeaveTypes,
    queryKey: ['leaveTypes'],
  });

  return (
    <div
      className={cn(
        ' flex w-1/5 min-w-[300px] flex-col  overflow-x-auto  rounded-r-sm border'
      )}
    >
      <div className="flex h-[40px] w-full   border-b ">
        {leaveTypesFunc.data?.map(({ code }) => (
          <span className="h-[40px] w-[40px] border-r" key={code}>
            {code}
          </span>
        ))}
      </div>
      {data.map(({ leaves }) => (
        <div className="flex h-[40px] w-full   border-b ">
          {leaveTypesFunc.data?.map(({ code }, index) => (
            <span className="h-[40px] w-[40px] border-r" key={index}>
              {code}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LeaveTotals;
