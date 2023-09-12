import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService, MasterData } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard)
  @Get('master')
  getMasterData(@Req() req): Promise<MasterData> {
    return this.appService.getMasterDate(req.user);
  }
}
