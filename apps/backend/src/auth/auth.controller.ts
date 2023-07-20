import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginDto } from './dtos/index.dtos';
import { IUser } from 'src/users/models/index.models';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @Post('/login')
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) res,
  ): Promise<IUser> {
    const { authToken, user } = await this.authService.login(input);
    res.cookie('aid', authToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000, // 1 day
      secure: this.configService.get('NODE_ENV') === 'production',
    });

    return user;
  }
}
