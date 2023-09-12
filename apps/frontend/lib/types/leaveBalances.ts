import { ILeaveType } from './leaveTypes';

export interface ILeaveBalance {
  remainingDays: number;
  leaveTypeCode: string;
  finYearId: number;
  userId: number;
  leaveTypes: ILeaveType;
}

export interface IAnnualLeaveBalance {
  remainingDays: number;
  finYearId: number;
  userId: number;
}

export interface ILeaveBalances {
  leaveBalances: ILeaveBalance[];
  annualLeaveBalance: IAnnualLeaveBalance;
}
