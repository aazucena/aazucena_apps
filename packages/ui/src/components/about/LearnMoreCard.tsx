/**
 * LearnMoreCard Component
 * Interactive card linking to detailed content pages
 */

import type { JSX } from 'react';
import { IconRenderer } from '../blocks/IconRenderer.js';
import { cn } from '@aazucena/utils';
import type { IconComponent } from '@aazucena/types';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'group rounded-lg border p-4 transition-all duration-300 hover:scale-105',
  {
    variants: {
      variant: {
        'cyan-blue':
          'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-400/20 hover:to-blue-500/20 border-cyan-400/30',
        'emerald-teal':
          'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-400/20 hover:to-teal-500/20 border-emerald-400/30',
        'purple-pink':
          'bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-400/20 hover:to-pink-500/20 border-purple-400/30',
        'orange-red':
          'bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-400/20 hover:to-red-500/20 border-orange-400/30',
        'indigo-purple':
          'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-400/20 hover:to-purple-500/20 border-indigo-400/30',
      },
    },
    defaultVariants: {
      variant: 'cyan-blue',
    },
  },
);

const iconContainerVariants = cva(
  'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
  {
    variants: {
      variant: {
        'cyan-blue': 'bg-gradient-to-br from-cyan-400 to-blue-500',
        'emerald-teal': 'bg-gradient-to-br from-emerald-400 to-teal-500',
        'purple-pink': 'bg-gradient-to-br from-purple-400 to-pink-500',
        'orange-red': 'bg-gradient-to-br from-orange-400 to-red-500',
        'indigo-purple': 'bg-gradient-to-br from-indigo-400 to-purple-500',
      },
    },
    defaultVariants: {
      variant: 'cyan-blue',
    },
  },
);

const buttonVariants = cva('flex items-center gap-2 text-xs font-medium', {
  variants: {
    variant: {
      'cyan-blue': 'text-cyan-400',
      'emerald-teal': 'text-emerald-400',
      'purple-pink': 'text-purple-400',
      'orange-red': 'text-orange-400',
      'indigo-purple': 'text-indigo-400',
    },
  },
  defaultVariants: {
    variant: 'cyan-blue',
  },
});

export interface LearnMoreCardProps extends VariantProps<typeof cardVariants> {
  /** Link destination */
  href?: string;
  /** Card title */
  title: string;
  /** Card description */
  children?: React.ReactNode;
  /** Icon for the card header */
  icon: IconComponent;
  /** Button text */
  buttonText: string;
  /** Button icon */
  buttonIcon?: IconComponent;
  /** Additional card classes */
  className?: string;
  /** Additional icon container classes */
  iconClassName?: string;
  /** Additional button classes */
  buttonClassName?: string;
}

/**
 * LearnMoreCard
 *
 * Interactive card with variant styling
 */
export function LearnMoreCard({
  className,
  iconClassName,
  buttonClassName,
  variant,
  href,
  title,
  children,
  icon,
  buttonText,
  buttonIcon,
}: LearnMoreCardProps): JSX.Element {
  return (
    <a href={href} className={cn(cardVariants({ variant }), className)}>
      <div className="mb-2 flex items-center gap-3">
        <div className={cn(iconContainerVariants({ variant }), iconClassName)}>
          <IconRenderer icon={icon} className="h-5 w-5 text-white" />
        </div>
        <h4 className="text-base font-bold text-white">{title}</h4>
      </div>

      {children && <p className="mb-2 text-xs text-gray-400">{children}</p>}

      <div className={cn(buttonVariants({ variant }), buttonClassName)}>
        <span>{buttonText}</span>
        {buttonIcon && (
          <IconRenderer
            icon={buttonIcon}
            className="h-3 w-3 transition-transform group-hover:translate-x-1"
          />
        )}
      </div>
    </a>
  );
}
