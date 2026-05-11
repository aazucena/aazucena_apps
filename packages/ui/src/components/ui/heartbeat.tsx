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
        'flex flex-col gap-4 rounded-[2rem] border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-zinc-700',
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
    className={cn(
      'flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800',
      className,
    )}
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
    className={cn('text-[8px] font-bold tracking-widest text-zinc-400 uppercase', className)}
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
    className={cn(
      'font-mono text-[10px] font-bold text-zinc-600 uppercase dark:text-zinc-400',
      className,
    )}
    {...props}
  />
));
HeartbeatDetailValue.displayName = 'HeartbeatDetailValue';
