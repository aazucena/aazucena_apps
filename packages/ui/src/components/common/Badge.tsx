/**
 * Badge Component
 * Reusable pill/tag badge with variant colors
 */

import type { JSX } from 'react';
import { cn } from '@aazucena/utils';
import type { ColorVariant, ButtonSize } from '@aazucena/types';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200',
  {
    variants: {
      variant: {
        cyan: 'bg-cyan-400/20 text-cyan-400',
        blue: 'bg-blue-400/20 text-blue-400',
        purple: 'bg-purple-400/20 text-purple-400',
        pink: 'bg-pink-400/20 text-pink-400',
        green: 'bg-emerald-400/20 text-emerald-400',
        teal: 'bg-teal-400/20 text-teal-400',
        orange: 'bg-orange-400/20 text-orange-400',
        red: 'bg-red-400/20 text-red-400',
        gray: 'bg-gray-400/20 text-gray-400',
      },
      size: {
        xs: 'px-2 py-0.5 text-xs',
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-1.5 text-base',
        lg: 'px-5 py-2 text-lg',
      },
    },
    defaultVariants: {
      variant: 'cyan',
      size: 'sm',
    },
  },
);

export interface LegacyBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof badgeVariants> {
  /** Click handler */
  onClick?: () => void;
}

/**
 * LegacyBadge
 */
export function LegacyBadge({
  children,
  variant,
  size,
  className,
  onClick,
  ...props
}: LegacyBadgeProps): JSX.Element {
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <span
      className={cn(
        badgeVariants({ variant, size }),
        isInteractive && 'cursor-pointer hover:brightness-110',
        className,
      )}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...props}
    >
      {children}
    </span>
  );
}
