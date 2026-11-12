'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Status Monitor Alert Components
 */

export const statusMonitorAlertVariants = cva(
  'group flex items-center justify-between rounded-card border p-4 transition-all duration-300',
  {
    variants: {
      level: {
        NOMINAL: 'border-success/10 bg-success/5 hover:border-success/30',
        WARNING: 'border-warning/10 bg-warning/5 hover:border-warning/30',
        CRITICAL: 'border-alert/10 bg-alert/5 hover:border-alert/30',
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
