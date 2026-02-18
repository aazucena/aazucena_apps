'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { BookOpen } from '@aazucena/icons';

const readingTimeVariants = cva('inline-flex items-center gap-2 transition-all duration-300', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      cyber: 'text-cyan-400 font-mono tracking-tight',
      bright: 'text-foreground font-bold',
      muted: 'text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.2em]',
    },
    size: {
      xs: 'text-[9px]',
      sm: 'text-[10px]',
      default: 'text-xs',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ReadingTimeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof readingTimeVariants> {}

const ReadingTime = React.forwardRef<HTMLDivElement, ReadingTimeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(readingTimeVariants({ variant, size }), className)} {...props} />
    );
  },
);
ReadingTime.displayName = 'ReadingTime';

const ReadingTimeIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode }
>(({ className, icon, ...props }, ref) => (
  <div ref={ref} className={cn('flex shrink-0 items-center justify-center', className)} {...props}>
    {icon || <BookOpen size={14} className="opacity-70" />}
  </div>
));
ReadingTimeIcon.displayName = 'ReadingTimeIcon';

const ReadingTimeValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('whitespace-nowrap', className)} {...props} />
  ),
);
ReadingTimeValue.displayName = 'ReadingTimeValue';

export { ReadingTime, ReadingTimeIcon, ReadingTimeValue, readingTimeVariants };
