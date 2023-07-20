import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AssignUserDto, CreateUserDto } from './dtos/index.dtos';
import { IUser } from './models/index.models';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('assign')
  assignUser(@Body() user: AssignUserDto): Promise<IUser> {
    return this.usersService.assignUser(user);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  createUser(@Body() user: CreateUserDto): Promise<IUser> {
    return this.usersService.createUser(user);
  }
}
