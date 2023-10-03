import { eachDayOfInterval, isWeekend } from 'date-fns';
import { ILeave } from '../types/leave';
import { ILeaveType } from '../types/leaveTypes';

const getWeekDays = (start: Date, end: Date): Date[] => {
  const allDates = eachDayOfInterval({
    start,
    end,
  });
  return allDates.filter((date) => !isWeekend(date));
};

export function countWeekdays(startDate: Date, endDate: Date) {
  return getWeekDays(startDate, endDate).length;
}

type ISummary = {
  [key: string]: {
    total: number;
    days: Date[];
  };
};

export const prepareUserLeaves = (
  leaves: ILeave[],
  leaveTypes: ILeaveType[]
): ISummary => {
  const summary: ISummary = {};
  for (const leaveTypeIndex in leaveTypes) {
    const leaveType = leaveTypes[leaveTypeIndex];
    summary[leaveType.code] = { total: 0, days: []};
  }
  for (const index in leaves) {
    const leave = leaves[index];

    const weekDays = getWeekDays(
      new Date(leave.startDate),
      new Date(leave.endDate)
    );

    summary[leave.leaveTypes.code] = {
      total: summary[leave.leaveTypes.code].total,

      days: [...summary[leave.leaveTypes.code].days, ...weekDays],
    };
  }

  for (const key in summary) {
    summary[key as string] = {
      total: summary[key as string].days.length,

      days: summary[key as string].days,
    };
  }

  return summary;
};
