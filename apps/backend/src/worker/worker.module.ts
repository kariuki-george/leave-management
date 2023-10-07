import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { FinyearModule } from 'src/finyear/finyear.module';
import { LeavesModule } from 'src/leaves/leaves.module';
import { OffdaysModule } from 'src/offdays/offdays.module';

@Module({
  providers: [WorkerService],
  imports: [FinyearModule, LeavesModule, OffdaysModule],
})
export class WorkerModule {}
