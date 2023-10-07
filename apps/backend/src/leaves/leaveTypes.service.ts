import { PrismaService } from '@db';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './dtos/index.dtos';
import { ILeaveType } from './models/index.models';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeaveTypesService {
  private readonly logger = new Logger(LeaveTypesService.name);
  constructor(private readonly dbService: PrismaService) {}

  async createLeaveType({
    code,
    isAnnualLeaveBased,
    maxDays,
    name,
  }: CreateLeaveTypeDto): Promise<ILeaveType> {
    try {
      const leaveType = await this.dbService.leaveTypes.create({
        data: {
          code,
          name,
          isAnnualLeaveBased,
          maxDays,
        },
      });
      return leaveType;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Leave Type with the provided code already exists'
        );
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAll(filter: Prisma.LeaveTypesWhereInput): Promise<ILeaveType[]> {
    // Check cache

    const leaveTypes = await this.dbService.leaveTypes.findMany({
      orderBy: { disabled: 'asc' },
      where: filter,
    });

    return leaveTypes;
  }

  async getLeaveType(code: string): Promise<ILeaveType> {
    // Check cache
    const leaveType = await this.dbService.leaveTypes.findUnique({
      where: { code },
    });
    if (!leaveType) {
      throw new NotFoundException('LeaveType not found');
    }

    return leaveType;
  }

  async updateLeaveType(
    leaveTypeCode: string,
    { disabled, isAnnualLeaveBased, name, maxDays }: UpdateLeaveTypeDto
  ): Promise<ILeaveType> {
    return this.dbService.leaveTypes.update({
      where: { code: leaveTypeCode },
      data: { disabled, isAnnualLeaveBased, name, maxDays },
    });
  }
}
