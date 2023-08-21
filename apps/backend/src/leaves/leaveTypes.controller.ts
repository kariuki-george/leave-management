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
import { RolesGuard } from 'src/roles/guards/roles.guards';

@Controller('leavetypes')
export class LeaveTypesController {
  constructor(private readonly leaveTypesService: LeaveTypesService) {}

  // Only the admin can create a leaveType
  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard, RolesGuard)
  createLeaveType(@Body() input: CreateLeaveTypeDto): Promise<ILeaveType> {
    return this.leaveTypesService.createLeaveType(input);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(): Promise<ILeaveType[]> {
    return this.leaveTypesService.getAll();
  }
}
