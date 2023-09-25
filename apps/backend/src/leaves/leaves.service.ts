import { PrismaService } from '@db';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ICheckLeaveConfig, ILeaveWithUser } from './models/index.models';
import { CreateLeaveDto, IGetLeavesFilterDto } from './dtos/index.dtos';
import { IUser } from 'src/users/models/index.models';
import { UsersService } from 'src/users/users.service';

import { SharedService } from 'src/shared/shared.service';
import { LeaveTypesService } from './leaveTypes.service';
import { FinyearService } from 'src/finyear/finyear.service';
import { LeaveBalancesService } from './leaveBalances.service';
import { eachDayOfInterval, isWeekend } from 'date-fns';
import { OffdaysService } from 'src/offdays/offdays.service';

@Injectable()
export class LeavesService {
  private readonly logger = new Logger(LeavesService.name);
  constructor(
    private readonly dbService: PrismaService,
    private readonly usersService: UsersService,
    private readonly sharedService: SharedService,
    private readonly leaveTypesService: LeaveTypesService,
    private readonly finYearService: FinyearService,
    private readonly leaveBalancesService: LeaveBalancesService,
    private readonly offDaysService: OffdaysService
  ) {
    this.countDays(1, new Date('2023-12-21'), new Date('2024-01-01'));
  }

  async createLeave(
    input: CreateLeaveDto,
    user: IUser
  ): Promise<ILeaveWithUser> {
    const { finYearId, totalDays, leaveType, endDate, startDate } =
      await this.checkLeaveConfig(input, user.userId);

    try {
      let leaveResponse;
      if (leaveType.isAnnualLeaveBased) {
        leaveResponse = await this.dbService.$transaction([
          this.dbService.leaves.create({
            data: {
              endDate,
              startDate,
              totalDays,
              finYear: { connect: { finYearId } },
              users: {
                connect: {
                  userId: user.userId,
                },
              },
              leaveTypes: {
                connect: { code: leaveType.code },
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
              finYear: { connect: { finYearId } },

              users: {
                connect: {
                  userId: user.userId,
                },
              },
              leaveTypes: {
                connect: { code: leaveType.code },
              },
            },

            include: { leaveTypes: true },
          }),
          this.dbService.leaveBalances.update({
            where: {
              userId_leaveTypeCode_finYearId: {
                finYearId,
                userId: user.userId,
                leaveTypeCode: leaveType.code,
              },
            },

            data: { remainingDays: { decrement: totalDays } },
          }),
        ]);
      }

      await this.usersService.invalidateCache(user.userId);

      return { ...leaveResponse[0], users: user };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //NOTE: Returns all leaves in a leave year

  async getLeaves(filter: IGetLeavesFilterDto): Promise<ILeaveWithUser[]> {
    const { finYearId, leaveTypeCode, limit, userId } = filter;

    const leaves = await this.dbService.leaves.findMany({
      where: { userId, leaveTypeCode, finYearId },
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
      take: limit,
    });

    // TODO: CACHE BETTER: RESTRICT FILTER TO A CERTAIN USER IF POSSIBLE OR INVALIDATE GLOBAL CACHES UPON MUTATIONS
    // await this.cacheService.set('leaves-' + JSON.stringify(filter), leaves);
    return leaves;
  }

  // async getUsersWithLeaves() {
  //   console.log(
  //     await this.dbService.users.findMany({
  //       include: {
  //         leaves: {
  //           include: { finYear :true,leaveTypes:true},
  //         },
  //       },
  //     })
  //   );
  // }

  async checkLeaveConfig(
    { code, endDate, startDate }: CreateLeaveDto,
    userId: number
  ): Promise<ICheckLeaveConfig> {
    endDate = this.sharedService.setTime(endDate, true);
    startDate = this.sharedService.setTime(startDate);
    const finYearId = (await this.finYearService.getCurrentFinYear()).finYearId;
    await this.validateLeaveDates(startDate, endDate);
    const leaveType = await this.leaveTypesService.getLeaveType(code);
    const totalDays = await this.countDays(finYearId, startDate, endDate);
    const onLeave = await this.isOnLeave(startDate, endDate, userId, finYearId);

    if (onLeave.isOnleave) {
      throw new BadRequestException(
        'Another leave overlaps with this leave, kindly check the start and end dates.'
      );
    }

    //  Validate maxleavedays
    await this.leaveBalancesService.validateMaxLeaveDays(
      totalDays,
      userId,
      leaveType,
      finYearId
    );

    return {
      totalDays,
      usersOnLeave: onLeave.userLeaves,
      leaveType,
      endDate,
      startDate,
      finYearId,
    };
  }

  // Validate the dates are within the financial year
  private async validateLeaveDates(
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const currentFinYear = await this.finYearService.getCurrentFinYear();

    if (
      new Date(currentFinYear.startDate) > startDate ||
      new Date(currentFinYear.endDate) < endDate
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
    userId: number,
    finYearId: number
  ): Promise<{ isOnleave: boolean; userLeaves: ILeaveWithUser[] }> {
    // Criteria

    const usersOnLeave: ILeaveWithUser[] = await this.dbService.leaves.findMany(
      {
        where: {
          finYearId,
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
        select: {
          startDate: true,
          leaveId: true,
          endDate: true,
          users: { select: { email: true, firstName: true, userId: true } },
          leaveTypes: true,
        },
      }
    );

    // Cache this value for a user's use
    let isOnleave = false;

    for (const m in usersOnLeave) {
      const leave = usersOnLeave[m];
      if (leave.users.userId === userId) {
        isOnleave = true;
        break;
      }
    }

    return { isOnleave, userLeaves: usersOnLeave };
  }

  private countDays = async (
    finYearId: number,
    start: Date,
    end: Date
  ): Promise<number> => {
    end = this.sharedService.setTime(end);

    const allDates = eachDayOfInterval({
      start,
      end,
    });
    const offDaysMap = await this.offDaysService.getOffDaysMap(finYearId);

    const withoutOffdays = allDates.filter((date) => {
      if (isWeekend(date)) {
        return false;
      }

      if (offDaysMap.has(new Date(date).toDateString())) {
        return false;
      }
      return true;
    });

    console.log(withoutOffdays);

    return withoutOffdays.length;
  };
}
