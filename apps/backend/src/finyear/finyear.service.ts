import { PrismaService } from '@db';
import { Injectable } from '@nestjs/common';
import { FinYear } from './models/index.models';
import { SharedService } from 'src/shared/shared.service';

// BEWARE OF SERVER TIME

@Injectable()
export class FinyearService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly sharedService: SharedService
  ) {}

  async createFinYear(
    startDate: Date,
    endDate: Date,
    author: string
  ): Promise<FinYear> {
    return this.dbService.finYear.create({
      data: { endDate, startDate, author },
    });
  }

  async getFinYears(): Promise<FinYear[]> {
    await this.getCurrentFinYear();
    return this.dbService.finYear.findMany();
  }

  async getCurrentFinYear(): Promise<FinYear> {
    const current = await this.dbService.finYear.findFirst({
      where: { status: 'CURRENT' },
    });

    if (
      current &&
      current.startDate < new Date() &&
      current.endDate > new Date()
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

  private newFinancialYearDates(): { startDate: Date; endDate: Date } {
    // Leave year starts on July year1 to June year2
    const currentYear = new Date().getFullYear();

    const startDate = this.sharedService.setTime(
      this.sharedService.constructDate(currentYear, 6, 1)
    );
    const endDate = this.sharedService.setTime(
      this.sharedService.constructDate(currentYear + 1, 5, 1),
      true
    );

    return { endDate, startDate };
  }
}
