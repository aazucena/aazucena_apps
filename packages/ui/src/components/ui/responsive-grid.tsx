'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const responsiveGridVariants = cva('grid transition-all duration-500', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    },
    variant: {
      default: '',
      archive: 'w-full',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
    variant: 'default',
  },
});

export interface ResponsiveGridProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof responsiveGridVariants> {}

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ className, cols, gap, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(responsiveGridVariants({ cols, gap, variant }), className)}
        {...props}
      />
    );
  },
);
ResponsiveGrid.displayName = 'ResponsiveGrid';

export { ResponsiveGrid, responsiveGridVariants };
