import { PrismaService } from '@db';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IUser } from 'src/users/models/index.models';
import { ChangePasswordDto, LoginDto } from './dtos/index.dtos';
import * as argon from 'argon2';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mails/mail.service';
import { LeavesService } from 'src/leaves/leaves.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly dbService: PrismaService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly leavesService: LeavesService
  ) {}

  async login({
    email,
    password,
  }: LoginDto): Promise<{ user: IUser; authToken: string }> {
    // Get user
    const user = await this.dbService.users.findUnique({
      where: { email, disabled: false },
    });
    if (!user) {
      throw new NotFoundException(
        'User with the provided details does not exist or has been blocked'
      );
    }
    // Validate pass
    const isValid = await argon.verify(user.password, password);

    if (!isValid) {
      throw new BadRequestException('Wrong email or password provided');
    }

    // Check renewable leave days
    const leaveDays = this.leavesService.renewLeaveDays(user);
    let updatedUser: IUser;
    if (leaveDays) {
      updatedUser = await this.usersService.updateUser(user.userId, {
        jwtVersion: user.jwtVersion + 1,
        leaveRemaining: leaveDays,
        leaveLastUpdateDate: new Date(),
      });
    } else {
      updatedUser = await this.usersService.updateUser(user.userId, {
        jwtVersion: user.jwtVersion + 1,
      });
    }

    // Create tokens

    const authToken = sign(
      {
        email,
        userId: user.userId,
        version: user.jwtVersion + 1,
        expires: Date.now() + 1000 * 60 * 60 * 24, // 1 day
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
    let payload: {
      userId: number;
      email: string;
      version: number;
      expires: number;
    };
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
    if (user.disabled) {
      throw new BadRequestException('Authentication failed');
    }

    // Validate token version
    if (payload.version !== user.jwtVersion)
      throw new BadRequestException('Authentication failed');

    // Validate token expiry date
    if (payload.expires < Date.now()) {
      throw new BadRequestException('Authentication failed');
    }

    return user;
  }

  logout(userId: number) {
    return this.usersService.updateUser(userId, { jwtVersion: 0 });
  }

  async changePassword({ password, token }: ChangePasswordDto) {
    let payload: {
      userId: number;
      expires: number;
    };
    try {
      payload = (await verify(token, this.configService.get('JWT_SECRET'), {
        audience: 'LMS-AUTH-PASSRESET',
        issuer: 'LMS',
      })) as typeof payload;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Password reset failed, please retry the entire process'
      );
    }

    // Validate token expiry date
    if (payload.expires < Date.now()) {
      throw new BadRequestException('Authentication failed');
    }

    const newPass = await argon.hash(password);
    let user;
    try {
      user = await this.usersService.updateUser(payload.userId, {
        password: newPass,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Something went wrong, please try again');
    }

    return user;
  }
  async requestPasswordChange(email: string): Promise<boolean> {
    const user = await this.dbService.users.findUnique({
      where: { email, disabled: false },
    });

    if (!user) {
      throw new NotFoundException(
        'User with the provided email not found or is blocked'
      );
    }

    const token = sign(
      {
        userId: user.userId,
        expires: Date.now() + 1000 * 60 * 30, // Expires in 30 minutes
      },
      this.configService.get('JWT_SECRET'),
      { audience: 'LMS-AUTH-PASSRESET', issuer: 'LMS' }
    );

    // Send mail
    await this.mailService.sendPasswordResetEmail(email, token, user.firstName);

    return true;
  }
}
