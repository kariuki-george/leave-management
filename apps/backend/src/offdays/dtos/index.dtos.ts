import { IsDateString, IsString } from 'class-validator';

export class CreateOffDay {
  @IsDateString()
  date: Date;
  @IsString()
  name: string;
}
