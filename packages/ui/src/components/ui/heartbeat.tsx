'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';

/**
 * Heartbeat (Service Status) Components
 */

export const HeartbeatItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-card border-rule bg-panel hover:border-rule dark:bg-panel/30 flex flex-col gap-4 border p-6 transition-all',
        className,
      )}
      {...props}
    />
  ),
);
HeartbeatItem.displayName = 'HeartbeatItem';

export const HeartbeatHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center justify-between', className)} {...props} />
));
HeartbeatHeader.displayName = 'HeartbeatHeader';

export const HeartbeatFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-rule flex items-center justify-between border-t pt-4', className)}
    {...props}
  />
));
HeartbeatFooter.displayName = 'HeartbeatFooter';

export const HeartbeatDetail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: 'left' | 'right' }
>(({ className, align = 'left', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col', align === 'right' ? 'text-right' : 'text-left', className)}
    {...props}
  />
));
HeartbeatDetail.displayName = 'HeartbeatDetail';

export const HeartbeatDetailLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'text-muted-foreground text-[8px] font-bold tracking-widest uppercase',
      className,
    )}
    {...props}
  />
));
HeartbeatDetailLabel.displayName = 'HeartbeatDetailLabel';

export const HeartbeatDetailValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('text-muted-foreground font-mono text-[10px] font-bold uppercase', className)}
    {...props}
  />
));
HeartbeatDetailValue.displayName = 'HeartbeatDetailValue';
