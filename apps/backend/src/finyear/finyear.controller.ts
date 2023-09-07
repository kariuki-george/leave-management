import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinYear } from './models/index.models';
import { FinyearService } from './finyear.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guards';

@Controller('finyears')
export class FinyearController {
  constructor(private readonly finYearService: FinyearService) {}

  @Get()
  @UseGuards(AuthGuard)
  getFinYears(): Promise<FinYear[]> {
    return this.finYearService.getFinYears();
  }
  @Get('/current')
  @UseGuards(AuthGuard, RolesGuard)
  getCurrentFinYear(): Promise<FinYear> {
    return this.finYearService.getCurrentFinYear();
  }
}
