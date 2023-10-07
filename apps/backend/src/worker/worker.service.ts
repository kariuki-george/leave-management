import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FinyearService } from 'src/finyear/finyear.service';
import { LeaveBalancesService } from 'src/leaves/leaveBalances.service';
import { OffdaysService } from 'src/offdays/offdays.service';

@Injectable()
export class WorkerService implements OnModuleInit {
  private readonly logger = new Logger(WorkerService.name);
  constructor(
    private readonly finYearService: FinyearService,
    private readonly leaveBalancesService: LeaveBalancesService,
    private readonly offDaysService: OffdaysService
  ) {}
  async onModuleInit() {
    this.logger.log('RUNNING INIT CHECKS AND SETTING CONFIGS');
    await this.newMonthCleanup();
  }
  //  Set financial Year
  //  Renew Annual Leave Balances
  // TODO: Set time
  // TODO: Check redis

  // Cron jobs
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    timeZone: 'Africa/Nairobi',
  })
  async newMonthCleanup() {
    try {
      this.logger.log('1. SETTING FINYEAR');
      const finYear = await this.finYearService.getCurrentFinYear();

      this.logger.log(JSON.stringify(finYear));
      this.logger.log('2. RENEWING ANNUAL LEAVE BALANCES');
      await this.leaveBalancesService.renewBalances();
      this.logger.log('3. RENEWING OFFDAYS');
      await this.offDaysService.renewOffDays(finYear);

      this.logger.log('4. RENEWING DONE');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
