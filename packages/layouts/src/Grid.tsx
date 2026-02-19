import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

const gridVariants = cva('grid', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});

/** Static col count map — template literals are not Tailwind-safe */
const colsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {
  /** Number of columns in the grid. Defaults to `12`. */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Render as a different HTML element. */
  as?: React.ElementType;
}

/**
 * A 12-column named grid layout.
 *
 * Pair with `GridItem` to assign explicit column spans per child.
 * Use `AutoGrid` instead when you want CSS auto-fill/auto-fit behaviour.
 *
 * @example
 * ```tsx
 * <Grid cols={12} gap="lg">
 *   <GridItem span={8}><MainContent /></GridItem>
 *   <GridItem span={4}><Sidebar /></GridItem>
 * </Grid>
 * ```
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, gap, cols = 12, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(gridVariants({ gap }), colsMap[cols], className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Grid.displayName = 'Grid';

// ---------------------------------------------------------------------------
// GridItem
// ---------------------------------------------------------------------------

/** Static lookup maps — NEVER use template literals with Tailwind */
const spanMap: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
};

const smMap: Record<number, string> = {
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
  5: 'sm:col-span-5',
  6: 'sm:col-span-6',
  7: 'sm:col-span-7',
  8: 'sm:col-span-8',
  9: 'sm:col-span-9',
  10: 'sm:col-span-10',
  11: 'sm:col-span-11',
  12: 'sm:col-span-12',
};

const mdMap: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
};

const lgMap: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
};

const xlMap: Record<number, string> = {
  1: 'xl:col-span-1',
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
  5: 'xl:col-span-5',
  6: 'xl:col-span-6',
  7: 'xl:col-span-7',
  8: 'xl:col-span-8',
  9: 'xl:col-span-9',
  10: 'xl:col-span-10',
  11: 'xl:col-span-11',
  12: 'xl:col-span-12',
};

const startMap: Record<number, string> = {
  1: 'col-start-1',
  2: 'col-start-2',
  3: 'col-start-3',
  4: 'col-start-4',
  5: 'col-start-5',
  6: 'col-start-6',
  7: 'col-start-7',
  8: 'col-start-8',
  9: 'col-start-9',
  10: 'col-start-10',
  11: 'col-start-11',
  12: 'col-start-12',
  13: 'col-start-13',
};

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ColStart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base column span (all breakpoints unless overridden). */
  span?: ColSpan;
  /** Column span at the `sm` breakpoint. */
  sm?: ColSpan;
  /** Column span at the `md` breakpoint. */
  md?: ColSpan;
  /** Column span at the `lg` breakpoint. */
  lg?: ColSpan;
  /** Column span at the `xl` breakpoint. */
  xl?: ColSpan;
  /** Explicit column start position. */
  start?: ColStart;
  /** Render as a different HTML element. */
  as?: React.ElementType;
}

/**
 * A grid cell that participates in a `Grid`'s 12-column layout.
 * Supports responsive `col-span-n` at every major breakpoint.
 */
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, sm, md, lg, xl, start, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          span != null && spanMap[span],
          sm != null && smMap[sm],
          md != null && mdMap[md],
          lg != null && lgMap[lg],
          xl != null && xlMap[xl],
          start != null && startMap[start],
          className,
        )}
        {...props}
      />
    );
  },
);
GridItem.displayName = 'GridItem';
