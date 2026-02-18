'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { AwardBadge } from '@aazucena/icons';

const hexagonCardVariants = cva(
  'group relative flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300',
  {
    variants: {
      variant: {
        award: 'text-orange-400',
        certification: 'text-cyan-400',
      },
      size: {
        sm: 'h-40 w-36',
        default: 'h-52 w-48',
        lg: 'h-64 w-56',
      },
    },
    defaultVariants: {
      variant: 'award',
      size: 'default',
    },
  },
);

const hexagonIconVariants = cva(
  'mb-3 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl',
  {
    variants: {
      variant: {
        award: 'from-yellow-400 to-orange-500',
        certification: 'from-cyan-400 to-blue-500',
      },
      size: {
        sm: 'h-12 w-12',
        default: 'h-16 w-16',
        lg: 'h-20 w-20',
      },
    },
    defaultVariants: {
      variant: 'award',
      size: 'default',
    },
  },
);

export interface HexagonCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof hexagonCardVariants> {
  dashed?: boolean;
  icon?: React.ReactNode;
}

const HexagonCard = React.forwardRef<HTMLDivElement, HexagonCardProps>(
  ({ className, variant, size, dashed, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        className={cn(hexagonCardVariants({ variant, size }), className)}
        {...props}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 110">
          <polygon
            points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={dashed ? '8,4' : undefined}
            className="group-hover:fill-opacity-20 transition-all duration-300 group-hover:stroke-[3]"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center p-6 text-center">
          <div className={cn(hexagonIconVariants({ variant, size }))}>
            {icon || <AwardBadge size={size === 'sm' ? 24 : 32} className="text-primary-foreground" />}
          </div>
          {children}
        </div>
      </div>
    );
  },
);
HexagonCard.displayName = 'HexagonCard';

const HexagonCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('mb-1 text-sm font-bold text-foreground', className)} {...props} />
));
HexagonCardTitle.displayName = 'HexagonCardTitle';

const HexagonCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs opacity-70', className)} {...props} />
));
HexagonCardDescription.displayName = 'HexagonCardDescription';

export {
  HexagonCard,
  HexagonCardTitle,
  HexagonCardDescription,
  hexagonCardVariants,
  hexagonIconVariants,
};
