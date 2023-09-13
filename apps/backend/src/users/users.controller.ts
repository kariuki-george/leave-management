import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
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
    return this.usersService.getUsers({});
  }
  @Get('/admin')
  @UseGuards(AuthGuard, RolesGuard)
  getUsersAdmin(@Query('disabled') disabled: string) {
    console.log(disabled);
    return this.usersService.getUsers({ disabled: disabled === 'true' });
  }

  // Include the disabled users
  @Get('/all')
  @UseGuards(AuthGuard, RolesGuard)
  getAllUsers(@Query('disabled') disabled: string) {
    return this.usersService.getAllUsers(disabled === 'true');
  }

  @Put('/admin')
  @UseGuards(AuthGuard, RolesGuard)
  updateUser(@Body() input: AdminUpdateUserDto) {
    if (input.disabled) input.isAdmin = false;
    return this.usersService.updateUser(input.employeeId, input);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req) {
    return req.user;
  }
}
