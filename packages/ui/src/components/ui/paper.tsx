'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const paperVariants = cva('rounded-lg bg-background transition-shadow', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground',
      glass: 'glass text-foreground',
      cyber:
        'bg-black/80 border border-cyan-500/20 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.05)]',
      outlined: 'bg-background border border-border',
    },
    elevation: {
      0: 'shadow-none',
      1: 'shadow-sm',
      2: 'shadow-md',
      3: 'shadow-lg',
      4: 'shadow-xl',
      5: 'shadow-2xl',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
    square: {
      true: 'rounded-none',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    elevation: 1,
    padding: 'md',
    square: false,
  },
});

export interface PaperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paperVariants> {}

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ className, variant, elevation, padding, square, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(paperVariants({ variant, elevation, padding, square }), className)}
      {...props}
    />
  ),
);
Paper.displayName = 'Paper';

export { Paper, paperVariants };
