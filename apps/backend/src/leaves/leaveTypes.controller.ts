import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LeaveTypesService } from './leaveTypes.service';
import { ILeaveType } from './models/index.models';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './dtos/index.dtos';
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
    // Validate input
    if (input.isAnnualLeaveBased) {
      input.maxDays = 0;
    } else {
      if (!input.maxDays) {
        throw new BadRequestException(
          'Please enter a valid max number of dayss'
        );
      }
    }

    return this.leaveTypesService.createLeaveType(input);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(): Promise<ILeaveType[]> {
    return this.leaveTypesService.getAll();
  }
  @Put()
  @UseGuards(AuthGuard, RolesGuard)
  updateLeaveType(@Body() input: UpdateLeaveTypeDto): Promise<ILeaveType> {
    if (input.isAnnualLeaveBased) {
      input.maxDays = 0;
    }
    if (input.maxDays) {
      input.isAnnualLeaveBased = false;
    }

    return this.leaveTypesService.updateLeaveType(input.code, input);
  }
}
