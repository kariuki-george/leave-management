import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authToken = request.cookies['aid'];
    if (!authToken) {
      throw new ForbiddenException('Authentication failed');
    }

    const user = await this.authService.checkAuth(authToken);

    request.user = user;

    return true;
  }
}
