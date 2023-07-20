import { IsEmail, IsInt, IsString, IsStrongPassword } from 'class-validator';

export class AssignUserDto {
  @IsEmail()
  email: string;
  @IsStrongPassword({ minLength: 8 })
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
}
