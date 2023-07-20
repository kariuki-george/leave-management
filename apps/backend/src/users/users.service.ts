import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignUserDto, CreateUserDto } from './dtos/index.dtos';
import { PrismaService } from '@db';
import { IUser } from './models/index.models';
import * as argon from 'argon2';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async assignUser({
    employeeId,
    email,
    password,
  }: AssignUserDto): Promise<IUser> {
    //   Fetch User with the provided employee Id
    let user = await this.getUser(employeeId);

    if (!user) {
      throw new NotFoundException('The provided employeeId not found');
    }

    if (user.email) {
      throw new BadRequestException('The provided user already exists');
    }

    //   Hash pass

    const hash = await argon.hash(password);

    // Update user with the new Details and initialize the number of days remaining

    user = await this.dbService.users.update({
      where: { userId: employeeId },
      data: {
        email,
        password: hash,
        jwtVersion: 0,
        leaveLastUpdateDate: new Date(),
        leaveRemaining: 30,
      },
    });
    await this.invalidateCache(user.userId);

    return this.cleanUser(user as Users);
  }

  async createUser({
    employeeId,
    firstName,
    lastName,
  }: CreateUserDto): Promise<IUser> {
    try {
      const user = await this.dbService.users.create({
        data: { userId: employeeId, firstName, lastName },
      });

      return this.cleanUser(user);
    } catch (error) {
      // Handle user already exists
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'User with the provided info already exists',
        );
      }
      throw new BadRequestException('Something went wrong please try again');
    }
  }

  async updateUser(userId: number, input: Partial<Users>): Promise<IUser> {
    const user = await this.dbService.users.update({
      where: { userId },
      data: input,
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

    user = await this.dbService.users.findUnique({ where: { userId } });

    //   Method invoker should deal with the response approapriately
    if (!user) return null;
    await this.cacheService.set('user-' + userId, user);

    return this.cleanUser(user);
  }

  // Private methods

  private cleanUser(user: Users): IUser {
    delete user.jwtVersion;
    delete user.password;
    delete user.leaveLastUpdateDate;
    return user;
  }
}
