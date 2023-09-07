import { Module } from '@nestjs/common';
import { FinyearService } from './finyear.service';
import { FinyearController } from './finyear.controller';

// FinYear to represent the financial year😂
@Module({
  providers: [FinyearService],
  controllers: [FinyearController],
  exports: [FinyearService],
})
export class FinyearModule {}
