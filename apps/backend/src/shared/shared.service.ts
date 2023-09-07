import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  constructDate = (year: number, month: number, day: number): Date => {
    let date = new Date();
    // Set year
    date = new Date(date.setFullYear(year));

    // Set month

    date = new Date(date.setMonth(month));

    // Set day
    date = new Date(date.setDate(day));

    return date;
  };
  setTime(date: Date, isEnd?: boolean): Date {
    if (isEnd) {
      return new Date(new Date(date).setHours(23, 59, 59, 999));
    }

    return new Date(new Date(date).setHours(0, 0, 0, 0));
  }
}
