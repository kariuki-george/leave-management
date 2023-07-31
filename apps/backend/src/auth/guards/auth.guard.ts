import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    let authToken;
    if (this.configService.get('NODE_ENV') === 'development') {
      authToken = request.headers.aid;
    } else {
      authToken = request.cookies['aid'];
    }

    if (!authToken) {
      throw new ForbiddenException('Authentication failed');
    }

    const user = await this.authService.checkAuth(authToken);

    request.user = user;

    return true;
  }
}
