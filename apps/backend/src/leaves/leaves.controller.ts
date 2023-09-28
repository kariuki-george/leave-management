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
import { parseISO, parseJSON } from 'date-fns';

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

  @Get('users')
  @UseGuards(AuthGuard)
  getUserLeaves(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('finYearId') finYearId: number
  ) {
    if (
      !(startDate && endDate) ||
      parseJSON(startDate).toString() === 'Invalid Date' ||
      parseJSON(endDate).toString() === 'Invalid Date'
    ) {
      throw new BadRequestException('Please include valid start and end Dates');
    }

    if (!finYearId || !Number(finYearId)) {
      throw new BadRequestException('Please add a financial year');
    }

    console.log(startDate, endDate);

    return this.leavesService.getUsersWithLeaves(
      Number(finYearId),
      parseJSON(startDate),
      parseJSON(endDate)
    );
  }
}
