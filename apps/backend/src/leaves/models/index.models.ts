import { IUser } from 'src/users/models/index.models';

export class ILeaveType {
  code: string;
  name: string;
}

export class ILeave {
  leaveId: number;
  startDate: Date;
  endDate: Date;
  userId: number;
  leaveTypes: ILeaveType;
}

// leaves with user
export class ILeaveWithUser {
  leaveId: number;
  startDate: Date;
  endDate: Date;
  leaveTypes: ILeaveType;
  users: Partial<IUser>;
}
