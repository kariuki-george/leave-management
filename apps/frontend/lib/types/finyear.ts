export interface FinYear {
  finYearId: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  author: string;
  status: 'CURRENT' | 'RETIRED';
}
