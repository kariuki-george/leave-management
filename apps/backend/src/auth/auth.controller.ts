import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dtos/index.dtos';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }
}
