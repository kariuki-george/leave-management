// LEAVETYPES

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  code: string;
  @IsString()
  name: string;
  @IsBoolean()
  isAnnualLeaveBased: boolean;
  @IsInt()
  @IsPositive()
  @IsOptional()
  maxDays: number;
}

export class CreateLeaveDto {
  @IsString()
  startDate: Date;
  @IsString()
  endDate: Date;
  @IsString()
  code: string;
  @IsInt()
  totalDays: number;
}
