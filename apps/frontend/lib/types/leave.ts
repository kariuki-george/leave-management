import { ILeaveType } from './leaveTypes';
import { IUser } from './user';
import { FinYear } from './finyear';

export interface ILeave {
  leaveId: number;
  startDate: Date;
  endDate: Date;
  userId: number;
  leaveTypes: ILeaveType;
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
