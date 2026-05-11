'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const masonryVariants = cva('transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      glass: 'rounded-2xl p-4 glass',
      cyber:
        'rounded-2xl p-4 bg-background/40 dark:bg-black/40 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface MasonryProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof masonryVariants> {
  columns?: number | { sm?: number; md?: number; lg?: number };
  gap?: number;
}

const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ className, variant, columns = 3, gap = 16, children, style, ...props }, ref) => {
    const _colCount = typeof columns === 'number' ? columns : (columns.md ?? 3);
    const responsiveClass =
      typeof columns === 'object'
        ? [
            columns.sm ? `columns-${columns.sm}` : '',
            columns.md ? `md:columns-${columns.md}` : '',
            columns.lg ? `lg:columns-${columns.lg}` : '',
          ]
            .filter(Boolean)
            .join(' ')
        : '';

    return (
      <div
        ref={ref}
        className={cn(masonryVariants({ variant }), responsiveClass, className)}
        style={{
          columnCount: typeof columns === 'number' ? columns : undefined,
          columnGap: gap,
          ...style,
        }}
        {...props}
      >
        {React.Children.map(children, (child) => (
          <div style={{ breakInside: 'avoid', marginBottom: gap }}>{child}</div>
        ))}
      </div>
    );
  },
);
Masonry.displayName = 'Masonry';

export { Masonry, masonryVariants };
