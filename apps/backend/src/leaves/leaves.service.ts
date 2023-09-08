import { PrismaService } from '@db';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ILeave, ILeaveWithUser } from './models/index.models';
import { CreateLeaveDto } from './dtos/index.dtos';
import { IUser } from 'src/users/models/index.models';
import { UsersService } from 'src/users/users.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Users } from '@prisma/client';
import { SharedService } from 'src/shared/shared.service';
import { LeaveTypesService } from './leaveTypes.service';
import { FinyearService } from 'src/finyear/finyear.service';
import { LeaveBalancesService } from './leaveBalances.service';

@Injectable()
export class LeavesService {
  private readonly logger = new Logger(LeavesService.name);
  constructor(
    private readonly dbService: PrismaService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly sharedService: SharedService,
    private readonly leaveTypesService: LeaveTypesService,
    private readonly finYearService: FinyearService,
    private readonly leaveBalancesService: LeaveBalancesService
  ) {}

  async createLeave(
    { code, endDate, startDate, totalDays }: CreateLeaveDto,
    user: IUser
  ): Promise<ILeaveWithUser> {
    endDate = this.sharedService.setTime(endDate, true);
    startDate = this.sharedService.setTime(startDate);
    const { finYearId } = await this.finYearService.getCurrentFinYear();

    // Validity of dates
    await this.validateLeaveDates(startDate, endDate);

    // Get leave Type
    const leaveType = await this.leaveTypesService.getLeaveType(code);

    // Validate that the user is not on any leave
    if (await this.isOnLeave(startDate, endDate, user.userId)) {
      throw new BadRequestException(
        'Another leave overlaps with this leave, kindly check the start and end dates.'
      );
    }

    // Validate number of max  leave days
    await this.leaveBalancesService.validateMaxLeaveDays(
      totalDays,
      user.userId,
      leaveType
    );

    try {
      let leaveResponse;
      if (leaveType.isAnnualLeaveBased) {
        leaveResponse = await this.dbService.$transaction([
          this.dbService.leaves.create({
            data: {
              endDate,
              startDate,
              totalDays,

              users: {
                connect: {
                  userId: user.userId,
                },
              },
              leaveTypes: {
                connect: { code },
              },
            },

            include: { leaveTypes: true },
          }),
          this.dbService.annualLeaveBalances.update({
            where: { userId: user.userId },
            data: { remainingDays: { decrement: totalDays } },
          }),
        ]);
      }
      if (!leaveType.isAnnualLeaveBased) {
        leaveResponse = await this.dbService.$transaction([
          this.dbService.leaves.create({
            data: {
              endDate,
              startDate,
              totalDays,

              users: {
                connect: {
                  userId: user.userId,
                },
              },
              leaveTypes: {
                connect: { code },
              },
            },

            include: { leaveTypes: true },
          }),
          this.dbService.leaveBalances.upsert({
            where: {
              userId_leaveTypeCode_finYearId: {
                finYearId,
                userId: user.userId,
                leaveTypeCode: code,
              },
            },
            create: {
              remainingDays: leaveType.maxDays - totalDays,
              finYear: { connect: { finYearId } },
            },
            update: { remainingDays: { decrement: totalDays } },
          }),
        ]);
      }

      await this.cacheService.del('leaves-code-' + code);
      await this.cacheService.del('leaves-user-' + user.userId);
      await this.cacheService.del('leaves-recent');
      await this.usersService.invalidateCache(user.userId);

      return { ...leaveResponse[0], users: user };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //NOTE: Returns all leaves in a leave year
  async getUserLeaves(userId: number): Promise<ILeave[]> {
    // Set dates
    const { startDate } = await this.finYearService.getCurrentFinYear();

    let leaves: ILeave[] = await this.cacheService.get('leaves-user-' + userId);
    if (leaves) {
      return leaves;
    }
    leaves = await this.dbService.leaves.findMany({
      where: { userId, startDate: { gte: startDate } },
      include: { leaveTypes: true },
    });
    await this.cacheService.set('leaves-user-' + userId, leaves);
    return leaves;
  }

  async getLeavesByLeaveType(code: string): Promise<ILeaveWithUser[]> {
    const { startDate } = await this.finYearService.getCurrentFinYear();

    let leaves: ILeaveWithUser[] = await this.cacheService.get(
      'leaves-code-' + code
    );
    if (leaves) {
      return leaves;
    }
    leaves = await this.dbService.leaves.findMany({
      where: { startDate: { gte: startDate }, leaveTypeCode: code },
      include: {
        leaveTypes: true,
        users: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    await this.cacheService.set('leaves-code-' + code, leaves);
    return leaves;
  }

  async getRecentLeaves(): Promise<ILeaveWithUser[]> {
    const { startDate } = await this.finYearService.getCurrentFinYear();

    let leaves: ILeaveWithUser[] = await this.cacheService.get('leaves-recent');
    if (leaves) {
      return leaves;
    }
    leaves = await this.dbService.leaves.findMany({
      where: { startDate: { gte: startDate } },
      include: {
        leaveTypes: true,
        users: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    await this.cacheService.set('leaves-recent', leaves);
    return leaves;
  }

  // Validate the dates are within the financial year
  private async validateLeaveDates(
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const currentFinYear = await this.finYearService.getCurrentFinYear();

    if (
      currentFinYear.startDate > startDate ||
      currentFinYear.endDate < endDate
    ) {
      throw new BadRequestException(
        'All leaves should be within the current financial year'
      );
    }
    return true;
  }

  // TODO: BEWARE OF SERVER TIME

  private async isOnLeave(
    startDate: Date,
    endDate: Date,
    userId: number
  ): Promise<boolean> {
    // Criteria

    const isOnLeave = await this.dbService.leaves.findFirst({
      where: {
        userId,
        OR: [
          {
            AND: [
              {
                startDate: {
                  gte: startDate,
                },
              },
              {
                startDate: {
                  lte: endDate,
                },
              },
            ],
          },
          {
            AND: [
              {
                startDate: {
                  lte: startDate,
                },
              },
              {
                endDate: {
                  gte: endDate,
                },
              },
            ],
          },
          {
            AND: [
              {
                endDate: {
                  lte: endDate,
                },
              },
              {
                endDate: {
                  gte: startDate,
                },
              },
            ],
          },
        ],
      },
    });

    return Boolean(isOnLeave);
  }
}
