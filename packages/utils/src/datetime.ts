import { DateTime } from 'luxon';

/**
 * Calculates duration string from start and end dates
 */
export function calculateDuration(
  startDate: string,
  endDate?: string,
  isCurrent: boolean = false,
): string {
  const start = new Date(startDate);
  const end = isCurrent ? new Date() : new Date(endDate || '');

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  const totalMonths = years * 12 + months;
  const dYears = Math.floor(totalMonths / 12);
  const dMonths = totalMonths % 12;

  let result = '';
  if (dYears > 0) result += `${dYears} yr${dYears > 1 ? 's' : ''} `;
  if (dMonths > 0) result += `${dMonths} mo${dMonths > 1 ? 's' : ''}`;

  return result.trim() || '1 mo';
}

/**
 * Calculate duration between two dates in months
 */
export function calculateMonthsDuration(start: Date, end: Date): number {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(months, 1); // At least 1 month
}

/**
 * Calculate detailed duration using Luxon
 * Returns a string formatted with years and days
 */
export function calculateDetailedDuration(start: Date, end: Date): string {
  const startDt = DateTime.fromJSDate(start);
  const endDt = DateTime.fromJSDate(end);

  // Get duration in years and days
  const diff = endDt.diff(startDt, ['years', 'months', 'days']).toObject();

  const years = Math.floor(diff.years || 0);
  const months = Math.floor(diff.months || 0);
  const days = Math.floor(diff.days || 0);

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }

  return parts.length > 0 ? parts.join(', ') : '1 day';
}
