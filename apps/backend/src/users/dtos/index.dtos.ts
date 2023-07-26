import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

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
