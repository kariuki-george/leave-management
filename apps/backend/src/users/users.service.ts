import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  AdminUpdateUserDto,
  AssignUserDto,
  CreateUserDto,
} from './dtos/index.dtos';
import { PrismaService } from '@db';
import { IUser } from './models/index.models';
import * as argon from 'argon2';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Users } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { FinyearService } from '../finyear/finyear.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly dbService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly configService: ConfigService,
    private readonly finYearService: FinyearService
  ) {}

  async assignUser({
    employeeId,
    email,
    password,
  }: AssignUserDto): Promise<IUser> {
    //   Fetch User with the provided employee Id
    let user = await this.getUser(employeeId);

    if (!user) {
      throw new NotFoundException(
        'The provided user not found, please check your details'
      );
    }

    if (user.email) {
      throw new BadRequestException('The provided user already exists');
    }

    //   Hash pass

    const hash = await argon.hash(password, {
      secret: Buffer.from(this.configService.get('PASS_SECRET') as string),
    });

    // Update user with the new Details and initialize the number of days remaining

    try {
      user = await this.dbService.users.update({
        where: { userId: employeeId },
        data: {
          email,
          password: hash,
          jwtVersion: 0,
        },
      });
      await this.invalidateCache(user.userId);

      return this.cleanUser(user as Users);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createUser({
    employeeId,
    firstName,
    isAdmin,
    lastName,
    gender,
  }: CreateUserDto): Promise<IUser> {
    try {
      const { finYearId } = await this.finYearService.getCurrentFinYear();
      const user = await this.dbService.users.create({
        data: {
          userId: employeeId,
          firstName,
          lastName,
          isAdmin,
          gender,
          annualLeaveBalances: {
            create: { remainingDays: 30, finYear: { connect: { finYearId } } },
          },
        },
      });

      return this.cleanUser(user);
    } catch (error) {
      // Handle user already exists
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'User with the provided info already exists'
        );
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // Only the admin can perform updateUser operation. To add update user to individual users ontop of admin,
  // Beware of the input not being validated vulnerability.
  async updateUser(
    userId: number,
    { disabled, isAdmin, firstName, lastName, gender }: AdminUpdateUserDto
  ): Promise<IUser> {
    const user = await this.dbService.users.update({
      where: { userId },
      data: { disabled, isAdmin, firstName, lastName, gender },
    });
    await this.invalidateCache(userId);

    return this.cleanUser(user);
  }

  async invalidateCache(userId: number) {
    return await this.cacheService.del('user-' + userId);
  }

  async getUser(userId: number): Promise<IUser> {
    // Check in cache
    let user: Users = await this.cacheService.get('user-' + userId);

    if (user) {
      return this.cleanUser(user);
    }

    try {
      user = await this.dbService.users.findUnique({
        where: { userId, disabled: false },
      });

      //   Method invoker should deal with the response appropriately
      if (!user) return null;
      // If a user is disabled, It's the same as if the user is deleted.
      await this.cacheService.set('user-' + userId, user);

      return this.cleanUser(user);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getUsers(filter: Partial<IUser>): Promise<Partial<IUser>[]> {
    let users: Partial<IUser>[] = await this.cacheService.get(
      'users' + JSON.stringify(filter)
    );

    if (users) return users;

    users = await this.dbService.users.findMany({
      select: {
        firstName: true,
        lastName: true,
        userId: true,
        email: true,
        gender: true,
      },
      where: filter,
    });

    await this.cacheService.set('users' + JSON.stringify(filter), users);
    return users;
  }

  async getAllUsers(disabled: boolean): Promise<Partial<IUser>[]> {
    return this.dbService.users.findMany({
      select: {
        firstName: true,
        lastName: true,
        userId: true,
        email: true,
        disabled: true,
        gender: true,
        isAdmin: true,
      },
      where: { disabled },
    });
  }

  cleanUser(user: Users): IUser {
    delete user.password;
    return user;
  }
}
