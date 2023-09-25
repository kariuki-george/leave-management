import { Injectable } from '@nestjs/common';
import { IUser } from './users/models/index.models';
import { ILeaveType, IUserLeaveBalance } from './leaves/models/index.models';
import { LeaveBalancesService } from './leaves/leaveBalances.service';
import { LeaveTypesService } from './leaves/leaveTypes.service';
import { FinyearService } from './finyear/finyear.service';

export interface MasterData {
  user: IUser;
  leaveTypes: ILeaveType[];
  leaveBalances: IUserLeaveBalance;
}

@Injectable()
export class AppService {
  constructor(
    private readonly leaveBalancesService: LeaveBalancesService,
    private readonly leaveTypesService: LeaveTypesService,
    private readonly finYearService: FinyearService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getMasterDate(user: IUser): Promise<MasterData> {
    console.log(user);
    const { finYearId } = await this.finYearService.getCurrentFinYear();

    const leaveBalances = await this.leaveBalancesService.getUserLeaveBalances(
      user.userId,
      finYearId
    );
    const leaveTypes = await this.leaveTypesService.getAll();

    return {
      user,
      leaveBalances,
      leaveTypes,
    };
  }
}
