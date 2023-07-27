import { Module } from '@nestjs/common';
import { LeaveTypesService } from './leaveTypes.service';
import { LeavesService } from './leaves.service';
import { LeaveTypesController } from './leaveTypes.controller';
import { LeavesController } from './leaves.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [LeaveTypesService, LeavesService],
  imports: [UsersModule],
  controllers: [LeaveTypesController, LeavesController],
  exports: [LeavesService],
})
export class LeavesModule {}
