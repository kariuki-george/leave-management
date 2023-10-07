import { PrismaService } from '@db';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOffDay } from './dtos/index.dtos';
import { OffDay } from './models/index.models';
import { Prisma } from '@prisma/client';
import { format, subYears } from 'date-fns';
import { FinYear } from 'src/finyear/models/index.models';

@Injectable()
export class OffdaysService {
  private readonly logger = new Logger(OffdaysService.name);

  constructor(private readonly dbService: PrismaService) {}

  async createOffDay(
    { date, name, recurring }: CreateOffDay,
    author: string
  ): Promise<OffDay> {
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();

    try {
      const offDay = await this.dbService.offDays.create({
        data: { date, name, author, recurring },
      });
      return offDay;
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException(
          'Holiday with the same details already exists'
        );
      this.logger.error(error);
      throw new BadRequestException('Something went wrong');
    }
  }
  async deleteOffDay(offDayId: number): Promise<boolean> {
    await this.dbService.offDays.delete({ where: { offDayId } });
    return true;
  }

  getOffDays(filter: Prisma.OffDaysWhereInput): Promise<OffDay[]> {
    return this.dbService.offDays.findMany({
      orderBy: [{ disabled: 'asc' }, { date: 'desc' }],
      where: filter,
    });
  }

  async getOffDaysMap(finYear: FinYear): Promise<Map<string, OffDay>> {
    const startDate = new Date(finYear.startDate);
    const endDate = new Date(finYear.endDate);
    const offDays = await this.getOffDays({
      disabled: false,
      AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
    });
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
  async renewOffDays(finYear: FinYear) {
    // Get all active offDays from the previous year
    const startDate = subYears(new Date(finYear.startDate), 1);
    const endDate = subYears(new Date(finYear.endDate), 1);
    const offDays = await this.getOffDays({
      disabled: false,
      recurring: true,
      AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
    });
    const failedDays = [];

    while (offDays.length) {
      const offDay = offDays[offDays.length - 1];
      const { name, date, disabled, recurring } = offDay;
      const newDate = new Date(date);
      const fnewDate = format(
        newDate.setFullYear(newDate.getFullYear() + 1),
        'yyyy-MM-dd'
      );

      try {
        await this.dbService.offDays.create({
          data: {
            date: fnewDate,
            name,
            disabled,
            recurring,
            author: 'SYSTEM',
          },
        });
        offDays.pop();
      } catch (error) {
        // Note: Might improve on this with better DB schema
        if (error.code === 'P2002') {
          // The offdays are already up to date
          offDays.pop();
          continue;
        }
        failedDays.push(offDay);
        offDays.pop();
        this.logger.error(error);
      }
    }

    offDays.length > 0 &&
      this.logger.error('Failed days', JSON.stringify(failedDays));
  }
}
