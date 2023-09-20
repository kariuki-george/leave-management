import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dtos/index.dtos';
import { ICheckLeaveConfig, ILeaveWithUser } from './models/index.models';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}
  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  createLeave(
    @Body() input: CreateLeaveDto,
    @Req() req
  ): Promise<ILeaveWithUser> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (
      startDate.toString() === 'Invalid Date' ||
      endDate.toString() === 'Invalid Date'
    ) {
      throw new BadRequestException('Invalid dates provided');
    }

    return this.leavesService.createLeave(
      { ...input, endDate, startDate },
      req.user
    );
  }
  @Post('check')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  checkLeave(
    @Body() input: CreateLeaveDto,
    @Req() req
  ): Promise<ICheckLeaveConfig> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (
      startDate.toString() === 'Invalid Date' ||
      endDate.toString() === 'Invalid Date'
    ) {
      throw new BadRequestException('Invalid dates provided');
    }

    return this.leavesService.checkLeaveConfig(
      { ...input, endDate, startDate },
      req.user.userId
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  getLeaves(
    @Query('leaveTypeCode') leaveTypeCode?: string,
    @Query('limit') limit?: number,
    @Query('userId') userId?: number,
    @Query('finYearId') finYearId?: number
  ) {
    limit = Number(limit) || undefined;
    userId = Number(userId) || undefined;
    finYearId = Number(finYearId) || undefined;

    return this.leavesService.getLeaves({
      leaveTypeCode,
      finYearId,
      limit,
      userId,
    });
  }
}
