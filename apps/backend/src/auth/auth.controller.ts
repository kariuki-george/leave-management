import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dtos/index.dtos';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }
}
