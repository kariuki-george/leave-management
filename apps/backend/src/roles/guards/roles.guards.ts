import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IUser } from 'src/users/models/index.models';

export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;

    if (!user) {
      throw new BadRequestException('Authentication failed');
    }

    //   Check if admin
    if (user.isAdmin) {
      return true;
    }

    throw new ForbiddenException(
      "You don't have the needed permissions for this operation"
    );
  }
}
