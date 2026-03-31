'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { Calendar, type CalendarProps } from './calendar';

export type { DateRange };

export interface RangeCalendarProps extends Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'> {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}

function RangeCalendar({ value, onChange, ...props }: RangeCalendarProps) {
  return <Calendar mode="range" selected={value} onSelect={onChange as any} {...(props as any)} />;
}
RangeCalendar.displayName = 'RangeCalendar';

export { RangeCalendar };
