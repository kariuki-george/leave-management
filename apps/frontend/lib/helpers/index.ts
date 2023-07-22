import { eachDayOfInterval, isWeekend } from 'date-fns';
import { ILeave } from '../types/leave';
import { IleaveTypeString } from '../types/leaveTypes';

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
  [key in IleaveTypeString]: {
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
    summary[key as IleaveTypeString] = {
      total: summary[key as IleaveTypeString].days.length,

      days: summary[key as IleaveTypeString].days,
    };
  }

  return summary;
};
