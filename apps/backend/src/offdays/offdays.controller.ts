import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffdaysService } from './offdays.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guards';
import { CreateOffDay } from './dtos/index.dtos';
import { OffDay } from './models/index.models';

@Controller('offdays')
export class OffdaysController {
  constructor(private readonly offDaysService: OffdaysService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  createOffDay(@Body() input: CreateOffDay, @Req() req): Promise<OffDay> {
    return this.offDaysService.createOffDay(
      { name: input.name, date: new Date(input.date) },
      req.user.userId.toString()
    );
  }
  @Get()
  @UseGuards(AuthGuard)
  getOffDays(): Promise<OffDay[]> {
    return this.offDaysService.getOffDays();
  }
}
