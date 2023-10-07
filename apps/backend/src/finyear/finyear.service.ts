import { PrismaService } from '@db';
import { Injectable } from '@nestjs/common';
import { FinYear } from './models/index.models';
import {
  format,
  isFuture,
  isPast,
  isToday,
  lastDayOfMonth,
  startOfMonth,
} from 'date-fns';

// BEWARE OF SERVER TIME

@Injectable()
export class FinyearService {
  constructor(private readonly dbService: PrismaService) {}

  async createFinYear(
    startDate: string,
    endDate: string,
    author: string
  ): Promise<FinYear> {
    return this.dbService.finYear.create({
      data: { endDate, startDate, author },
    });
  }

  async getFinYears(): Promise<FinYear[]> {
    await this.getCurrentFinYear();
    return this.dbService.finYear.findMany({ orderBy: { startDate: 'desc' } });
  }

  async getCurrentFinYear(): Promise<FinYear> {
    const current = await this.dbService.finYear.findFirst({
      where: { status: 'CURRENT' },
    });

    if (
      current &&
      (isPast(new Date(current.startDate)) ||
        isToday(new Date(current.startDate))) &&
      isFuture(new Date(current.endDate))
    ) {
      return current;
    }

    //   Create new Fin Year
    const { endDate, startDate } = this.newFinancialYearDates();

    if (!current) {
      const newFinYear = await this.dbService.finYear.create({
        data: { endDate, startDate, author: 'SYSTEM' },
      });
      return newFinYear;
    }

    const newFinYear = await this.dbService.$transaction([
      this.dbService.finYear.update({
        where: { finYearId: current.finYearId },
        data: { status: 'RETIRED' },
      }),
      this.dbService.finYear.create({
        data: { endDate, startDate, author: 'SYSTEM' },
      }),
    ]);

    return newFinYear[1];
  }

  private newFinancialYearDates(): { startDate: string; endDate: string } {
    // Leave year starts on July year1 to June year2
    const currentYear = new Date().getFullYear();

    const startDate = format(
      startOfMonth(new Date(currentYear, 6, 1)),
      'yyyy-MM-dd'
    );
    const endDate = format(
      lastDayOfMonth(new Date(currentYear + 1, 5)),
      'yyyy-MM-dd'
    );

    return { endDate, startDate };
  }
}
