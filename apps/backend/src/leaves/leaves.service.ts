import { PrismaService } from '@db';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ILeave, ILeaveWithUser } from './models/index.models';
import { CreateLeaveDto } from './dtos/index.dtos';
import { IUser } from 'src/users/models/index.models';
import { UsersService } from 'src/users/users.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LeavesService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache
  ) {}

  async createLeave(
    { code, endDate, startDate, totalDays }: CreateLeaveDto,
    user: IUser
  ): Promise<ILeave> {
    endDate = this.setTime(endDate);
    startDate = this.setTime(startDate);

    // Validity of dates
    if (!this.validateDates(startDate, endDate)) {
      throw new BadRequestException('Invalid start and end dates');
    }
    // Validate that the user is not on any leave
    if (await this.isOnLeave(startDate, endDate)) {
      throw new BadRequestException(
        'Another leave overlaps with this leave, kindly check the start and end dates.'
      );
    }
    // Validate number of remaining leaves
    user = await this.usersService.getUser(user.userId);
    if (user.leaveRemaining < totalDays) {
      throw new BadRequestException('Number of leave days exceeded');
    }
    try {
      const leaveResponse = await this.dbService.$transaction([
        this.dbService.leaves.create({
          data: {
            endDate,
            startDate,

            users: {
              connect: {
                userId: user.userId,
              },
            },
            leaveTypes: { connect: { code } },
          },

          include: { leaveTypes: true },
        }),
        this.dbService.users.update({
          where: { userId: user.userId },
          data: {
            leaveRemaining: user.leaveRemaining - totalDays,
            leaveLastUpdateDate: new Date(),
          },
        }),
      ]);
      await this.cacheService.del('leaves-code-' + code);
      await this.cacheService.del('leaves-user-' + user.userId);
      await this.usersService.invalidateCache(user.userId);

      return leaveResponse[0];
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('LeaveType provided not found');
      }
      throw new BadRequestException('An error occurred, try again');
    }
  }

  //NOTE: Returns all leaves in a leave year
  async getUserLeaves(userId: number): Promise<ILeave[]> {
    // Set dates
    const currentWorkingYear = this.getCurrentLeaveYear();

    let leaves: ILeave[] = await this.cacheService.get('leaves-user-' + userId);
    if (leaves) {
      return leaves;
    }
    leaves = await this.dbService.leaves.findMany({
      where: { userId, createdAt: { gte: currentWorkingYear } },
      include: { leaveTypes: true },
    });
    await this.cacheService.set('leaves-user-' + userId, leaves);
    return leaves;
  }

  async getLeaves(code: string): Promise<ILeaveWithUser[]> {
    const currentWorkingYear = this.getCurrentLeaveYear();

    let leaves: ILeaveWithUser[] = await this.cacheService.get(
      'leaves-code-' + code
    );
    if (leaves) {
      return leaves;
    }
    leaves = await this.dbService.leaves.findMany({
      where: { createdAt: { gte: currentWorkingYear }, leaveType: code },
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
    const currentWorkingYear = this.getCurrentLeaveYear();

    let leaves: ILeaveWithUser[] = await this.cacheService.get('leaves-recent');
    if (leaves) {
      return leaves;
    }
    leaves = await this.dbService.leaves.findMany({
      where: { createdAt: { gte: currentWorkingYear } },
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
    });
    await this.cacheService.set('leaves-recent', leaves);
    return leaves;
  }

  // TODO: BEWARE OF SERVER TIME

  private validateDates(startDate: Date, endDate: Date): boolean {
    const today = this.setTime(new Date(), true);
    return startDate > today && endDate >= startDate;
  }
  private setTime(date: Date, isEnd?: boolean): Date {
    if (isEnd) {
      return new Date(new Date(date).setHours(23, 59, 59, 999));
    }
    return new Date(new Date(date).setHours(0, 0, 0, 0));
  }

  private getCurrentLeaveYear() {
    // Leave year starts on June year1 to May year2
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let currentLeaveYear = new Date();
    let currentDate = new Date().getDate();

    if (currentMonth < 6) {
      currentYear -= 1;
      currentMonth = 5;
      currentDate = 1;
    }

    // Set year
    currentLeaveYear = new Date(currentLeaveYear.setFullYear(currentYear));

    // Set month

    currentLeaveYear = new Date(currentLeaveYear.setMonth(currentMonth));

    // Set day
    currentLeaveYear = new Date(currentLeaveYear.setDate(currentDate));

    return this.setTime(currentLeaveYear);
  }
  private async isOnLeave(startDate: Date, endDate: Date): Promise<boolean> {
    // Criteria

    const isOnLeave = await this.dbService.leaves.findFirst({
      where: {
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