'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';

/**
 * High-Density Engineering Field Components (IDE-style extensions)
 */

export const FieldHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-2 flex shrink-0 items-center justify-between gap-4', className)}
      {...props}
    />
  ),
);
FieldHeader.displayName = 'FieldHeader';

export const FieldMeta = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-foreground0 font-mono text-[8px] tracking-widest uppercase', className)}
      {...props}
    />
  ),
);
FieldMeta.displayName = 'FieldMeta';

export const FieldControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'default' | 'lg' | 'full' }
>(({ className, size = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex w-full flex-col',
      size === 'lg' && 'h-[450px]',
      size === 'full' && 'flex-1',
      className,
    )}
    {...props}
  />
));
FieldControl.displayName = 'FieldControl';
