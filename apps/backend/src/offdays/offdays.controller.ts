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
    // Validate date

    if (!input.date || new Date(input.date).toString() === 'Invalid Date') {
      throw new BadRequestException('Please add a valid date');
    }

    return this.offDaysService.createOffDay(input, req.user.userId.toString());
  }
  @Get()
  @UseGuards(AuthGuard)
  getOffDays(): Promise<OffDay[]> {
    return this.offDaysService.getOffDays();
  }
}
