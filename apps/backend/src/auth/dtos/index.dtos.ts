import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  password: string;
  @IsString()
  token: string;
}

export class RequestPasswordChangeDto {
  @IsEmail()
  email: string;
}
