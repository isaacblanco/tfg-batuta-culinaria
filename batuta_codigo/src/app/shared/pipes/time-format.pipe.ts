import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true, // Habilitar standalone
})
export class TimeFormatPipe implements PipeTransform {
  transform(seconds: number): string {
    if (seconds < 0 || isNaN(seconds)) {
      return '0 min';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
      return `${minutes} min`;
    }

    return `${minutes} min ${remainingSeconds} seg`;
  }
}
