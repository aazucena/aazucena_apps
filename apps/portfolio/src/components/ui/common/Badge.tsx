/**
 * Badge Component
 * Reusable pill/tag badge with variant colors
 * Used for skills, tags, categories, status indicators
 */

import type { JSX } from 'react';
import { cn } from '~/lib/utils';

export type BadgeVariant =
  | 'cyan'
  | 'blue'
  | 'emerald'
  | 'purple'
  | 'pink'
  | 'yellow'
  | 'orange'
  | 'gray'
  | 'white';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Color variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** Additional classes */
  className?: string;
  /** Click handler (makes badge interactive) */
  onClick?: () => void;
}

/**
 * Variant color mappings
 * Pre-defined for Tailwind JIT compatibility
 */
const variantStyles: Record<BadgeVariant, string> = {
  cyan: 'bg-cyan-400/20 text-cyan-400',
  blue: 'bg-blue-400/20 text-blue-400',
  emerald: 'bg-emerald-400/20 text-emerald-400',
  purple: 'bg-purple-400/20 text-purple-400',
  pink: 'bg-pink-400/20 text-pink-400',
  yellow: 'bg-yellow-400/20 text-yellow-400',
  orange: 'bg-orange-400/20 text-orange-400',
  gray: 'bg-gray-400/20 text-gray-400',
  white: 'bg-white/10 text-gray-400',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-1.5 text-base',
  lg: 'px-5 py-2 text-lg',
};

/**
 * Badge
 *
 * Versatile pill-shaped badge component:
 * - 9 color variants
 * - 4 size variants
 * - Optional interactive (clickable)
 * - Consistent rounded-full styling
 *
 * Used for:
 * - Skill tags (AboutSection, SkillsSection, ExperienceSection)
 * - Project tags (ProjectsSection)
 * - Category labels (BlogSection)
 * - Status indicators (AwardsSection)
 *
 * @example
 * ```tsx
 * // Skill badge
 * <Badge variant="cyan" size="sm">React</Badge>
 *
 * // Interactive tag
 * <Badge variant="blue" onClick={() => filterByTag('frontend')}>
 *   Frontend
 * </Badge>
 *
 * // "+N more" indicator
 * <Badge variant="white" size="xs">+5 more</Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'cyan',
  size = 'sm',
  className,
  onClick,
}: BadgeProps): JSX.Element {
  const isInteractive = Boolean(onClick);

  return (
    <span
      className={cn(
        // Base styling
        'inline-flex items-center justify-center font-medium rounded-full',
        'transition-colors duration-200',
        // Size
        sizeStyles[size],
        // Color variant
        variantStyles[variant],
        // Interactive
        isInteractive && 'cursor-pointer hover:brightness-110',
        // Custom classes
        className
      )}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {children}
    </span>
  );
}
