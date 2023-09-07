import { IsString } from 'class-validator';

export class CreateOffDay {
  @IsString()
  date: Date;
  @IsString()
  name: string;
}
