import { PrismaService } from '@db';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './dtos/index.dtos';
import { ILeaveType } from './models/index.models';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LeaveTypesService {
  private readonly logger = new Logger(LeaveTypesService.name);
  constructor(
    private readonly dbService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache
  ) {}

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
      await this.cacheService.del('leaveTypes');
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

  async getAll(): Promise<ILeaveType[]> {
    // Check cache
    let leaveTypes: ILeaveType[] = await this.cacheService.get('leaveTypes');
    if (leaveTypes) {
      return leaveTypes;
    }
    leaveTypes = await this.dbService.leaveTypes.findMany();

    await this.cacheService.set('leaveTypes', leaveTypes);
    return leaveTypes;
  }

  async getLeaveType(code: string): Promise<ILeaveType> {
    // Check cache
    let leaveType: ILeaveType = await this.cacheService.get('leaveType' + code);
    if (leaveType) {
      return leaveType;
    }
    leaveType = await this.dbService.leaveTypes.findUnique({
      where: { code },
    });
    if (!leaveType) {
      throw new NotFoundException('LeaveType not found');
    }
    await this.cacheService.set('leaveType' + code, leaveType);
    return leaveType;
  }

  async updateLeaveType(
    leaveTypeCode: string,
    { disabled, isAnnualLeaveBased, name, maxDays }: UpdateLeaveTypeDto
  ): Promise<ILeaveType> {
    await this.cacheService.del('leaveTypes');

    return this.dbService.leaveTypes.update({
      where: { code: leaveTypeCode },
      data: { disabled, isAnnualLeaveBased, name, maxDays },
    });
  }
}
