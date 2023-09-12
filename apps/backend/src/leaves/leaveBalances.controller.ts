import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LeaveBalancesService } from './leaveBalances.service';
import { IUserLeaveBalance } from './models/index.models';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('leaveBalances')
export class LeaveBalancesController {
  constructor(private readonly leaveBalancesService: LeaveBalancesService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUserLeaveBalances(@Req() req): Promise<IUserLeaveBalance> {
    return this.leaveBalancesService.getUserLeaveBalances(req.user.userId);
  }
}
