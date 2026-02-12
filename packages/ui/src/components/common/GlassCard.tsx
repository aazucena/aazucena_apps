/**
 * GlassCard Component
 * Base card with glass-morphism styling
 */

import type { JSX, ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const glassCardVariants = cva(
  'rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300',
  {
    variants: {
      padding: {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      hover: {
        true: 'hover:scale-[1.02] hover:bg-white/10',
        false: '',
      },
      clickable: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      padding: 'md',
      hover: false,
      clickable: false,
    },
  },
);

export interface GlassCardProps<T extends ElementType = 'div'> extends VariantProps<
  typeof glassCardVariants
> {
  /** HTML element to render as (div, article, section, etc.) */
  as?: T;
  /** Card content */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

/**
 * GlassCard
 */
export function GlassCard<T extends ElementType = 'div'>({
  as,
  children,
  hover,
  clickable,
  padding,
  className,
  ...props
}: GlassCardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof GlassCardProps<T>>): JSX.Element {
  const Component = as || 'div';

  return (
    <Component
      className={cn(glassCardVariants({ padding, hover, clickable }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
