import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dtos/index.dtos';
import { ILeave } from './models/index.models';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}
  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  createLeave(@Body() input: CreateLeaveDto, @Req() req): Promise<ILeave> {
    return this.leavesService.createLeave(input, req.user);
  }

  @Get('/user')
  @UseGuards()
  getLeavesByUserId(@Query('userId') userId: string) {
    if (!Number(userId)) {
      throw new BadRequestException('Invalid userId query param');
    }
    return this.leavesService.getUserLeaves(Number(userId));
  }

  @Get('/recent')
  @UseGuards()
  getRecentLeaves() {
    return this.leavesService.getRecentLeaves();
  }
  @Get()
  @UseGuards()
  getLeaves(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('LeaveTypeCode query param is missing');
    }
    return this.leavesService.getLeaves(code);
  }
}
