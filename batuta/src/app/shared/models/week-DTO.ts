import { DayDTO } from './day-DTO';

export interface WeekDTO {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  days: DayDTO[];
}
