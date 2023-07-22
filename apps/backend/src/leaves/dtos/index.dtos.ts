// LEAVETYPES

import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  code: string;
  @IsString()
  name: string;
}

export class CreateLeaveDto {
  startDate: Date;
  endDate: Date;
  @IsString()
  code: string;
  @IsInt()
  totalDays: number;
}
