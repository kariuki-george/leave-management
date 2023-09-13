import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

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
  @IsPositive()
  employeeId: number;
  @IsString()
  @MinLength(3)
  firstName: string;
  @IsString()
  @MinLength(3)
  lastName: string;
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
  @IsEnum(Gender)
  gender: Gender;
}

export class AdminUpdateUserDto extends PartialType(CreateUserDto) {
  @IsInt()
  employeeId: number;
  @IsBoolean()
  @IsOptional()
  disabled: boolean;
}
