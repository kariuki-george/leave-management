import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class AssignUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsInt()
  employeeId: number;
}

export class CreateUserDto {
  @IsInt()
  employeeId: number;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
  @IsEnum(Gender)
  gender: Gender;
}

export class AdminUpdateUserDto {
  @IsInt()
  userId: number;
  @IsBoolean()
  @IsOptional()
  disabled: boolean;
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}
