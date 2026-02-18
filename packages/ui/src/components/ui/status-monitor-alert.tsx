'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Status Monitor Alert Components
 */

export const statusMonitorAlertVariants = cva(
  'group flex items-center justify-between rounded-2xl border p-4 transition-all duration-300',
  {
    variants: {
      level: {
        NOMINAL: 'border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/30',
        WARNING: 'border-amber-500/10 bg-amber-500/5 hover:border-amber-500/30',
        CRITICAL: 'border-rose-500/10 bg-rose-500/5 hover:border-rose-500/30',
      },
    },
    defaultVariants: {
      level: 'NOMINAL',
    },
  },
);

export const StatusMonitorAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statusMonitorAlertVariants>
>(({ className, level, ...props }, ref) => (
  <div ref={ref} className={cn(statusMonitorAlertVariants({ level }), className)} {...props} />
));
StatusMonitorAlert.displayName = 'StatusMonitorAlert';
