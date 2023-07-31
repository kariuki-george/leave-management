import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginDto,
  RequestPasswordChangeDto,
} from './dtos/index.dtos';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { IUser } from 'src/users/models/index.models';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}
  @Post('/login')
  async login(@Body() input: LoginDto, @Res({ passthrough: true }) res) {
    const { authToken, user } = await this.authService.login(input);
    if (this.configService.get('NODE_ENV') === 'development') {
      return { user, authToken };
    }
    // Set cookie
    res.cookie('aid', authToken, {
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, //1 day
      domain: '.p.kariukigeorge.me',
      priority: 'high',
    });

    return user;
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
