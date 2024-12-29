import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'timeFormat',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number, unit: string = 'minutes'): string {
    if (value < 0 || isNaN(value)) {
      return '0 min';
    }

    if (unit === 'minutes') {
      return `${value} min`;
    }

    const minutes = Math.floor(value / 60);
    const remainingSeconds = value % 60;

    if (minutes === 0) {
      return `${remainingSeconds} seg`;
    }

    return `${minutes} min ${remainingSeconds} seg`;
  }
}