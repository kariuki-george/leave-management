import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOffDay {
  @IsDateString()
  date: string;
  @IsString()
  name: string;
  @IsBoolean()
  recurring: boolean;
}

export class UpdateOffDayDto extends PartialType(CreateOffDay) {
  @IsBoolean()
  @IsOptional()
  disabled: boolean;
  @IsInt()
  @IsPositive()
  offDayId: number;
}
