import { PrismaService } from '@db';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUser } from 'src/users/models/index.models';
import { LoginDto } from './dtos/index.dtos';
import * as argon from 'argon2';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async login({
    email,
    password,
  }: LoginDto): Promise<{ user: IUser; authToken: string }> {
    // Get user
    const user = await this.dbService.users.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        'User with the provided details does not exist'
      );
    }
    // Validate pass
    const isValid = await argon.verify(user.password, password);

    if (!isValid) {
      throw new BadRequestException('Wrong email or password provided');
    }

    // Create tokens

    const updatedUser = await this.usersService.updateUser(user.userId, {
      jwtVersion: user.jwtVersion + 1,
    });

    const authToken = sign(
      {
        email,
        userId: user.userId,
        version: user.jwtVersion + 1,
      },
      this.configService.get('JWT_SECRET'),
      {
        audience: 'LMS-AUTH',
        issuer: 'LMS',
      }
    );
    return { user: updatedUser, authToken };
  }

  async checkAuth(authToken: string): Promise<IUser> {
    // Verify authToken
    let payload: { userId: number; email: string; version: number };
    try {
      payload = (await verify(authToken, this.configService.get('JWT_SECRET'), {
        audience: 'LMS-AUTH',
        issuer: 'LMS',
      })) as typeof payload;
    } catch (error) {
      throw new BadRequestException('Authentication failed');
    }

    // Get User
    const user = await this.usersService.getUser(payload.userId);
    if (!user) {
      throw new BadRequestException('Authentication failed');
    }

    // Validate token version
    if (payload.version !== user.jwtVersion)
      throw new BadRequestException('Authentication failed');

    return user;
  }
}
