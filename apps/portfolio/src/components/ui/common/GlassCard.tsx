/**
 * GlassCard Component
 * Base card with glass-morphism styling
 * Reusable across all sections for consistent card appearance
 */

import type { JSX, ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '~/lib/utils';

export interface GlassCardProps<T extends ElementType = 'div'> {
  /** HTML element to render as (div, article, section, etc.) */
  as?: T;
  /** Card content */
  children: React.ReactNode;
  /** Enable hover effect (lift + background brighten) */
  hover?: boolean;
  /** Enable cursor pointer */
  clickable?: boolean;
  /** Padding size variant */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

const paddingVariants = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const;

/**
 * GlassCard
 *
 * Base card component with glass-morphism styling:
 * - Frosted glass background (`bg-white/5`)
 * - Backdrop blur effect
 * - Subtle border
 * - Optional hover effects
 * - Configurable padding
 *
 * Used across multiple sections for consistent card styling.
 *
 * @example
 * ```tsx
 * // Basic card
 * <GlassCard padding="md">Content here</GlassCard>
 *
 * // Interactive card
 * <GlassCard hover clickable onClick={handleClick}>
 *   Clickable content
 * </GlassCard>
 *
 * // Semantic article card
 * <GlassCard as="article" padding="lg">
 *   Article content
 * </GlassCard>
 * ```
 */
export function GlassCard<T extends ElementType = 'div'>({
  as,
  children,
  hover = false,
  clickable = false,
  padding = 'md',
  className,
  ...props
}: GlassCardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof GlassCardProps<T>>): JSX.Element {
  const Component = as || 'div';
  const paddingClass = paddingVariants[padding];

  return (
    <Component
      className={cn(
        // Base glass-morphism styling
        'bg-white/5 backdrop-blur-sm rounded-lg border border-white/10',
        // Padding
        paddingClass,
        // Hover effects
        hover && 'hover:bg-white/10 transition-all duration-300',
        hover && 'hover:scale-[1.02]',
        // Cursor
        clickable && 'cursor-pointer',
        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
