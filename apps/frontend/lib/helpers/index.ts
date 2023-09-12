import { eachDayOfInterval, isWeekend } from 'date-fns';
import { ILeave } from '../types/leave';

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

export const prepareUserLeaves = (leaves: ILeave[]): ISummary => {
  const summary: ISummary = {
    CL: { days: [], total: 0 },
    ML: { days: [], total: 0 },
    PL: { days: [], total: 0 },
    PTL: { days: [], total: 0 },
    SL: { days: [], total: 0 },
    UP: { days: [], total: 0 },
  };

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
