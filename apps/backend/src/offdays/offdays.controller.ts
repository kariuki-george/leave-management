import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffdaysService } from './offdays.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guards';
import { CreateOffDay, UpdateOffDayDto } from './dtos/index.dtos';
import { OffDay } from './models/index.models';

@Controller('offdays')
export class OffdaysController {
  constructor(private readonly offDaysService: OffdaysService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  createOffDay(@Body() input: CreateOffDay, @Req() req): Promise<OffDay> {
    console.log(input);
    return this.offDaysService.createOffDay(input, req.user.userId.toString());
  }
  @Get()
  @UseGuards(AuthGuard)
  getOffDays(): Promise<OffDay[]> {
    return this.offDaysService.getOffDays({});
  }

  @Put()
  @UseGuards(AuthGuard, RolesGuard)
  updateOffDay(@Body() input: UpdateOffDayDto): Promise<OffDay> {
    return this.offDaysService.updateOffDay(input.offDayId, input);
  }
}
