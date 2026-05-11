import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const autoGridVariants = cva('grid', {
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

export interface AutoGridProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof autoGridVariants> {
  /**
   * CSS Grid `auto-fill` vs `auto-fit` behaviour.
   * - `fill`: always creates the maximum number of track slots (may leave empty columns).
   * - `fit`: collapses empty tracks so filled items stretch to fill available space.
   * Defaults to `'fill'`.
   */
  mode?: 'fill' | 'fit';
  /**
   * Minimum column width passed to `minmax(minWidth, 1fr)`.
   * Defaults to `'250px'`.
   */
  minWidth?: string;
}

/**
 * A CSS `auto-fill` / `auto-fit` responsive grid.
 *
 * Unlike `Grid` (explicit 12-column), `AutoGrid` lets the browser decide how
 * many columns to create based on the available space and `minWidth`.
 *
 * Uses `style={{ gridTemplateColumns }}` to avoid Tailwind purging issues
 * with dynamic `minmax` values.
 *
 * @example
 * ```tsx
 * // Card grid: at least 280px wide, fills row automatically
 * <AutoGrid minWidth="280px" gap="lg">
 *   {cards.map(card => <Card key={card.id} {...card} />)}
 * </AutoGrid>
 *
 * // Auto-fit: last row items stretch to fill
 * <AutoGrid mode="fit" minWidth="200px">
 *   {items}
 * </AutoGrid>
 * ```
 */
export const AutoGrid = React.forwardRef<HTMLDivElement, AutoGridProps>(
  ({ className, gap, mode = 'fill', minWidth = '250px', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(autoGridVariants({ gap }), className)}
        style={{
          gridTemplateColumns: `repeat(auto-${mode}, minmax(${minWidth}, 1fr))`,
          ...style,
        }}
        {...props}
      />
    );
  },
);
AutoGrid.displayName = 'AutoGrid';
