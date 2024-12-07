/**
 * Formatea una fecha en el formato 'DD-MMM-AAAA HH:MM'
 * @param dateString - Fecha a formatear
 * @returns Fecha formateada como cadena
 */
export function formatDateTime(dateString: Date | string): string {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleString('es-ES', options).replace(',', ''); // 'es-ES' para formato en español
}

/**
 * Convierte un tiempo en formato 'HH:MM:SS' a un formato amigable como '1h 34m'
 * @param timeString - Tiempo en formato 'HH:MM:SS'
 * @returns Tiempo formateado como cadena
 */
export function timeFormat(timeString: string): string {
  if (!timeString) {
    return '';
  }

  const [hours, minutes] = timeString.split(':').map(Number);

  const hourPart = hours > 0 ? `${hours}h` : '';
  const minutePart = `${minutes}m`;

  return [hourPart, minutePart].filter(Boolean).join(' ');
}
