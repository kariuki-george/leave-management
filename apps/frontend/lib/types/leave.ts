import { ILeaveType } from './leaveTypes';
import { IUser } from './user';

export interface ILeave {
  leaveId: number;
  startDate: Date;
  endDate: Date;
  userId: number;
  leaveTypes: ILeaveType;
  totalDays: number;
  allLeaveDays: string;
}

// leaves with user
export interface ILeaveWithUser {
  leaveId: number;
  startDate: Date;
  endDate: Date;
  leaveTypes: ILeaveType;
  users: Partial<IUser>;
}

export interface IUserLeave {
  user: Partial<IUser>;
  leaves: { [key: string]: { code: string; name: string } };
}
