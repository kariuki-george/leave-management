import { PrismaService } from '@db';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ILeaveBalance,
  ILeaveType,
  IUserLeaveBalance,
} from './models/index.models';
import { FinyearService } from 'src/finyear/finyear.service';
import { AnnualLeaveBalances } from '@prisma/client';

@Injectable()
export class LeaveBalancesService {
  private logger = new Logger(LeaveBalancesService.name);
  constructor(
    private readonly dbService: PrismaService,
    private readonly finYearService: FinyearService
  ) {}
  // Validates the number of max days the user can apply for
  validateMaxLeaveDays = async (
    totalDays: number,

    userId: number,
    leaveType: ILeaveType,
    finYearId: number
  ): Promise<boolean> => {
    let remainingDays = 0;
    if (leaveType.isAnnualLeaveBased) {
      // Calc the total
      // Get all userleaves for annual based leaves
      const annualLeaveBalance =
        await this.dbService.annualLeaveBalances.findUnique({
          where: { userId },
        });
      remainingDays = annualLeaveBalance.remainingDays;
    }
    if (leaveType.maxDays) {
      const leaveBalance = await this.dbService.leaveBalances.findUnique({
        where: {
          userId_leaveTypeCode_finYearId: {
            finYearId,
            leaveTypeCode: leaveType.code,
            userId,
          },
        },
        select: {
          remainingDays: true,
        },
      });

      if (leaveBalance) {
        remainingDays = leaveBalance.remainingDays;
      } else {
        const leaveBalance = await this.createLeaveBalance(
          userId,
          finYearId,
          leaveType
        );
        remainingDays = leaveBalance.remainingDays;
      }
    }

    if (remainingDays < totalDays) {
      throw new BadRequestException('Number of leave days exceeded');
    }

    return true;
  };

  async renewBalances() {
    try {
      this.logger.log('Attempting to renew Annual Leave Balances');
      // Way more performant but prisma does not have a built in Check to have a max of 45 days
      //   await this.dbService.annualLeaveBalances.updateMany({
      //     data: {
      //       remainingDays: {
      //         increment: 30,
      //       },
      //     },where:{} // Finyearid IS NOT UP TO DATE
      //   });

      const { finYearId } = await this.finYearService.getCurrentFinYear();
      let balances: AnnualLeaveBalances[] = [];

      // Find better ways to optimize if limits are hit
      do {
        for (const balanceIndex in balances) {
          const { remainingDays, userId } = balances[balanceIndex];

          await this.dbService.annualLeaveBalances.update({
            data: {
              finYearId,
              remainingDays: remainingDays > 15 ? 45 : remainingDays + 30,
            },
            where: { userId },
          });
        }

        balances = await this.dbService.annualLeaveBalances.findMany({
          where: { finYearId: { not: finYearId } },
          take: 50,
        });
      } while (balances.length);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getUserLeaveBalances(
    userId: number,
    finYearId = 0
  ): Promise<IUserLeaveBalance> {
    if (!finYearId) {
      finYearId = (await this.finYearService.getCurrentFinYear()).finYearId;
    }
    const leaveBalances: ILeaveBalance[] =
      await this.dbService.leaveBalances.findMany({
        where: { userId, finYearId },
        select: {
          finYearId: true,
          leaveTypeCode: true,
          remainingDays: true,
          userId: true,
          leaveTypes: {
            select: {
              code: true,
              maxDays: true,
              name: true,
              isAnnualLeaveBased: true,
              disabled: true,
            },
          },
        },
      });
    const annualLeaveBalance =
      await this.dbService.annualLeaveBalances.findUnique({
        where: { userId, finYearId },
        select: {
          finYearId: true,

          remainingDays: true,
          userId: true,
        },
      });

    // TODO: Cache this heavy op

    return { annualLeaveBalance, leaveBalances };
  }

  createLeaveBalance(
    userId: number,
    finYearId: number,
    leaveType: ILeaveType
  ): Promise<ILeaveBalance> {
    return this.dbService.leaveBalances.create({
      data: {
        userId,
        finYearId,
        leaveTypeCode: leaveType.code,
        remainingDays: leaveType.maxDays,
      },
      include: { leaveTypes: true },
    });
  }
}
