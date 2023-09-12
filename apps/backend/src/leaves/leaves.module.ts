import { Module } from '@nestjs/common';
import { LeaveTypesService } from './leaveTypes.service';
import { LeavesService } from './leaves.service';
import { LeaveTypesController } from './leaveTypes.controller';
import { LeavesController } from './leaves.controller';
import { UsersModule } from 'src/users/users.module';
import { FinyearModule } from 'src/finyear/finyear.module';
import { LeaveBalancesService } from './leaveBalances.service';
import { LeaveBalancesController } from './leaveBalances.controller';

@Module({
  providers: [LeaveTypesService, LeavesService, LeaveBalancesService],
  imports: [UsersModule, FinyearModule],
  controllers: [
    LeaveTypesController,
    LeavesController,
    LeaveBalancesController,
  ],
  exports: [LeavesService, LeaveBalancesService, LeaveTypesService],
})
export class LeavesModule {}
