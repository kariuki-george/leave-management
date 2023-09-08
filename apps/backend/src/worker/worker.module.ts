import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { FinyearModule } from 'src/finyear/finyear.module';
import { LeavesModule } from 'src/leaves/leaves.module';

@Module({
  providers: [WorkerService],
  imports: [FinyearModule, LeavesModule],
})
export class WorkerModule {}
