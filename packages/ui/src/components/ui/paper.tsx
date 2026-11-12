'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const paperVariants = cva('rounded-control bg-background transition-shadow', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground',
      glass: 'glass text-foreground',
      cyber: 'bg-scrim border border-signal/20 text-foreground',
      outlined: 'bg-background border border-border',
    },
    elevation: {
      0: 'shadow-none',
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
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
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof paperVariants> {}

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
