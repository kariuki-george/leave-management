import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AdminUpdateUserDto,
  AssignUserDto,
  CreateUserDto,
} from './dtos/index.dtos';
import { IUser } from './models/index.models';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('assign')
  assignUser(@Body() user: AssignUserDto): Promise<IUser> {
    return this.usersService.assignUser(user);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard, RolesGuard)
  createUser(@Body() user: CreateUserDto): Promise<IUser> {
    return this.usersService.createUser(user);
  }

  @Get()
  @UseGuards(AuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  // Include the disabled users
  @Get('/all')
  @UseGuards(AuthGuard, RolesGuard)
  getAllUsers(@Req() req) {
    return this.usersService.getAllUsers(req.user.userId);
  }

  @Put('/admin')
  @UseGuards(AuthGuard, RolesGuard)
  disableUser(@Body() input: AdminUpdateUserDto) {
    return this.usersService.updateUser(input.userId, {
      ...input,
      isAdmin: input.disabled ? false : input.isAdmin,
    });
  }
}
