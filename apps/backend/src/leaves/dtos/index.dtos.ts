// LEAVETYPES

import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsIn,
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

export class UpdateLeaveTypeDto extends PartialType(CreateLeaveTypeDto) {
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
  @IsString()
  code: string;
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

export class IGetLeavesFilterDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  userId?: number;
  @IsInt()
  @IsPositive()
  @IsOptional()
  finYearId?: number;
  @IsString()
  @IsOptional()
  leaveTypeCode?: string;
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit?: number;
}
