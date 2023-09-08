import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FinyearService } from 'src/finyear/finyear.service';
import { LeaveBalancesService } from 'src/leaves/leaveBalances.service';

@Injectable()
export class WorkerService implements OnModuleInit {
  private readonly logger = new Logger(WorkerService.name);
  constructor(
    private readonly finYearService: FinyearService,
    private readonly leaveBalancesService: LeaveBalancesService
  ) {}
  async onModuleInit() {
    console.log('RUNNING INIT CHECKS AND SETTING CONFIGS');
    await this.onInit();
  }
  //  Set financial Year
  //  Renew Annual Leave Balances
  // TODO: Set time
  // TODO: Check redis
  async onInit() {
    await this.checkFinYear();
    await this.renewAnnualLeaveBalances();
  }

  async checkFinYear() {
    console.log('1. CHECKING FINYEAR');
    console.log(await this.finYearService.getCurrentFinYear());
  }
  async renewAnnualLeaveBalances() {
    console.log('2. RENEWING ANNUAL LEAVE BALANCES');
    await this.leaveBalancesService.renewBalances();
    console.log('2.1 RENEWING DONE');
  }

  // Cron jobs

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    timeZone: 'Africa/Nairobi',
  })
  async renewAnnualLeaveBalancesCron() {
    try {
      console.log('1. RENEWING ANNUAL LEAVE BALANCES');
      await this.leaveBalancesService.renewBalances();
      console.log('2. RENEWING DONE');
    } catch (error) {
      this.logger.error(error);
    }
  }
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    timeZone: 'Africa/Nairobi',
  })
  async setFinYear() {
    try {
      console.log('1. SETTING FINYEAR');
      console.log(await this.finYearService.getCurrentFinYear());
    } catch (error) {
      this.logger.error(error);
    }
  }
}
