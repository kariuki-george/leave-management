import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginDto,
  RequestPasswordChangeDto,
} from './dtos/index.dtos';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { IUser } from 'src/users/models/index.models';

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
    await this.authService.logout(req.user.userId);
    return true;
  }
  @Post('/request-pass-change')
  requestPasswordChange(
    @Body() input: RequestPasswordChangeDto
  ): Promise<boolean> {
    return this.authService.requestPasswordChange(input.email);
  }

  @Post('/change-pass')
  changePassword(@Body() input: ChangePasswordDto): Promise<IUser> {
    return this.authService.changePassword(input);
  }
}
