/**
 * ResponsiveGrid Component
 * Responsive grid layout wrapper with semantic column configuration
 * Eliminates repetitive grid class strings
 */

import type { JSX } from "react";
import { cn } from "~/lib/utils";

export interface ResponsiveGridProps {
  /** Grid items */
  children: React.ReactNode;
  /** Number of columns per breakpoint */
  cols?: {
    /** Mobile (default) */
    sm?: 1 | 2;
    /** Tablet (md breakpoint) */
    md?: 1 | 2 | 3 | 4;
    /** Desktop (lg breakpoint) */
    lg?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  /** Gap between items */
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  /** Additional classes */
  className?: string;
}

const gapVariants = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

const colClasses = {
  sm: {
    1: "grid-cols-1",
    2: "grid-cols-2",
  },
  md: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  },
  lg: {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  },
} as const;

/**
 * ResponsiveGrid
 *
 * Semantic responsive grid wrapper:
 * - Configurable columns per breakpoint
 * - Consistent gap sizing
 * - Cleaner than repetitive class strings
 *
 * Common patterns:
 * - Stats: 2 cols mobile, 3 cols desktop
 * - Cards: 1 col mobile, 2 cols tablet, 3 cols desktop
 * - Highlights: 1 col mobile, 2 cols desktop
 *
 * @example
 * ```tsx
 * // Stats grid (2 mobile, 3 desktop)
 * <ResponsiveGrid cols={{ sm: 2, md: 3 }} gap="md">
 *   {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
 * </ResponsiveGrid>
 *
 * // Card grid (1 mobile, 2 tablet, 3 desktop)
 * <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
 *   {cards.map(card => <Card key={card.id} {...card} />)}
 * </ResponsiveGrid>
 * ```
 */
export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3 },
  gap = "md",
  className,
}: ResponsiveGridProps): JSX.Element {
  const { sm = 1, md, lg } = cols;

  return (
    <div
      className={cn(
        "grid",
        // Base columns (mobile)
        colClasses.sm[sm],
        // Tablet columns
        md && colClasses.md[md],
        // Desktop columns
        lg && colClasses.lg[lg],
        // Gap
        gapVariants[gap],
        // Custom classes
        className,
      )}
    >
      {children}
    </div>
  );
}
