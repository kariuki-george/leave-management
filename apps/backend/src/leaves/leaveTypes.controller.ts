import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LeaveTypesService } from './leaveTypes.service';
import { ILeaveType } from './models/index.models';
import { CreateLeaveTypeDto } from './dtos/index.dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('leavetypes')
export class LeaveTypesController {
  constructor(private readonly leaveTypesService: LeaveTypesService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  createLeaveType(@Body() input: CreateLeaveTypeDto): Promise<ILeaveType> {
    return this.leaveTypesService.createLeaveType(input);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(): Promise<ILeaveType[]> {
    return this.leaveTypesService.getAll();
  }
}
