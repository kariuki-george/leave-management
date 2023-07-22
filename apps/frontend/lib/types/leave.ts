import { ILeaveType } from './leaveTypes';
import { IUser } from './user';

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
