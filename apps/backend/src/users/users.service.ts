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
import { MailService } from 'src/mails/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly mailService: MailService
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

    const hash = await argon.hash(password);

    // Update user with the new Details and initialize the number of days remaining

    try {
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
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong please try again');
    }
  }

  async createUser({
    employeeId,
    firstName,
    isAdmin,
    lastName,
  }: CreateUserDto): Promise<IUser> {
    try {
      const user = await this.dbService.users.create({
        data: { userId: employeeId, firstName, lastName, isAdmin },
      });

      return this.cleanUser(user);
    } catch (error) {
      // Handle user already exists
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'User with the provided info already exists'
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

    try {
      user = await this.dbService.users.findUnique({
        where: { userId, disabled: false },
      });

      //   Method invoker should deal with the response approapriately
      if (!user) return null;
      // If a user is disabled, It's the same as if the user is deleted.
      await this.cacheService.set('user-' + userId, user);

      return this.cleanUser(user);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong please try again');
    }
  }

  async getUsers(): Promise<Partial<IUser>[]> {
    let users: Partial<IUser>[] = await this.cacheService.get('users');

    if (users) return users;

    users = await this.dbService.users.findMany({
      select: {
        firstName: true,
        lastName: true,
        userId: true,
        leaveRemaining: true,
        email: true,
      },
      where: { disabled: false },
    });

    await this.cacheService.set('users', users);
    return users;
  }

  // Prevent admin from updating themselves - remove their admin status etc

  async getAllUsers(userId: number): Promise<Partial<IUser>[]> {
    return (
      await this.dbService.users.findMany({
        select: {
          firstName: true,
          lastName: true,
          userId: true,
          leaveRemaining: true,
          email: true,
          disabled: true,
          isAdmin: true,
        },
      })
    ).filter((user) => user.userId != userId);
  }

  cleanUser(user: Users): IUser {
    delete user.password;
    delete user.leaveLastUpdateDate;
    return user;
  }
}
