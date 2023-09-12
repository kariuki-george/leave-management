import {  ILeaveBalances } from './leaveBalances';
import { ILeaveType } from './leaveTypes';
import { IUser } from './user';

export interface MasterData {
  user: IUser;
  leaveTypes: ILeaveType[];
  leaveBalances: ILeaveBalances;
}
