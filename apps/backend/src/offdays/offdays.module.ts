import { Module } from '@nestjs/common';
import { OffdaysService } from './offdays.service';
import { OffdaysController } from './offdays.controller';
import { FinyearModule } from 'src/finyear/finyear.module';

@Module({
  providers: [OffdaysService],
  controllers: [OffdaysController],
  imports: [FinyearModule],
})
export class OffdaysModule {}
