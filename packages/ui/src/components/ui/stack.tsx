'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const stackVariants = cva('flex', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    variant: 'default',
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  divider?: React.ReactNode;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, variant, direction, gap, align, justify, wrap, divider, children, ...props }, ref) => {
    const items = React.Children.toArray(children).filter(Boolean);

    return (
      <div
        ref={ref}
        className={cn(stackVariants({ variant, direction, gap, align, justify, wrap }), className)}
        {...props}
      >
        {divider
          ? items.map((child, i) => (
              <React.Fragment key={i}>
                {i > 0 && divider}
                {child}
              </React.Fragment>
            ))
          : children}
      </div>
    );
  },
);
Stack.displayName = 'Stack';

export { Stack, stackVariants };
