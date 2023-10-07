import { PrismaService } from '@db';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOffDay } from './dtos/index.dtos';
import { OffDay } from './models/index.models';
import { SharedService } from 'src/shared/shared.service';
import { FinyearService } from 'src/finyear/finyear.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OffdaysService {
  private readonly logger = new Logger(OffdaysService.name);

  constructor(
    private readonly dbService: PrismaService,
    private readonly sharedService: SharedService,
    private readonly finYearService: FinyearService
  ) {}

  async createOffDay(
    { date, name }: CreateOffDay,
    author: string
  ): Promise<OffDay> {
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    try {
      const offDay = await this.dbService.offDays.create({
        data: { date, name, author },
      });
      return offDay;
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException(
          'Holiday with the same details already exists'
        );

      throw new BadRequestException('Something went wrong');
    }
  }
  async deleteOffDay(offDayId: number): Promise<boolean> {
    await this.dbService.offDays.delete({ where: { offDayId } });
    return true;
  }

  getOffDays(filter: Prisma.OffDaysWhereInput): Promise<OffDay[]> {
    return this.dbService.offDays.findMany({
      orderBy: { disabled: 'asc' },
      where: filter,
    });
  }

  async getOffDaysMap(finYearId: number): Promise<Map<string, OffDay>> {
    const offDays = await this.getOffDays({ disabled: false });
    const map = new Map<string, OffDay>();
    for (const m in offDays) {
      const offDay = offDays[m];
      map.set(offDay.date, offDay);
    }
    return map;
  }

  updateOffDay(
    offDayId: number,
    { date, name, disabled, recurring }: Partial<OffDay>
  ): Promise<OffDay> {
    return this.dbService.offDays.update({
      where: { offDayId },
      data: { date, name, disabled, recurring },
    });
  }

  // Autogenerate new offdays for a new Fin year
  async autoGenOffDays() {
    const offDays = await this.genericOffDays();
    try {
      await this.dbService.offDays.createMany({
        data: offDays.map((offDay) => ({
          date: offDay.date,
          name: offDay.name,
          author: 'SYSTEM',
        })),
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // The offdays are already up to date
        return;
      }
      this.logger.error(error);
      return;
    }
  }

  private async genericOffDays(): Promise<Partial<OffDay>[]> {
    const formatDate = (year: number, month: number, day: number): Date => {
      return this.sharedService.setTime(
        this.sharedService.constructDate(year, month, day)
      );
    };
    const startDate = new Date(
      (await this.finYearService.getCurrentFinYear()).startDate
    );
    const list: Partial<OffDay>[] = [
      {
        name: 'Christmas',
        date: formatDate(startDate.getFullYear(), 11, 25).toDateString(),
      },
      {
        name: 'Boxing',
        date: formatDate(startDate.getFullYear(), 11, 26).toDateString(),
      },
      {
        name: 'New Year',
        date: formatDate(startDate.getFullYear() + 1, 0, 1).toDateString(),
      },
    ];

    return list;
  }
}
