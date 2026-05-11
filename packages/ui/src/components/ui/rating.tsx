'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const ratingVariants = cva('inline-flex items-center gap-0.5', {
  variants: {
    variant: {
      default: 'text-amber-400',
      glass: 'text-amber-300/80',
      cyber: 'text-cyan-400',
    },
    size: {
      sm: '[&_svg]:size-4',
      md: '[&_svg]:size-5',
      lg: '[&_svg]:size-6',
      xl: '[&_svg]:size-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const StarIcon = ({ filled, half }: { filled: boolean; half?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <defs>
      <linearGradient id="star-half">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      fill={filled ? 'currentColor' : half ? 'url(#star-half)' : 'none'}
    />
  </svg>
);

export interface RatingProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof ratingVariants> {
  value?: number;
  max?: number;
  readOnly?: boolean;
  precision?: 'full' | 'half';
  onChange?: (value: number) => void;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      variant,
      size,
      value = 0,
      max = 5,
      readOnly = false,
      precision = 'full',
      onChange,
      ...props
    },
    ref,
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const displayValue = hoverValue ?? value;

    return (
      <div
        ref={ref}
        role={readOnly ? 'img' : 'radiogroup'}
        aria-label={`Rating: ${value} out of ${max}`}
        className={cn(ratingVariants({ variant, size }), className)}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = displayValue >= starValue;
          const half = precision === 'half' && !filled && displayValue >= starValue - 0.5;

          return (
            <span
              key={i}
              className={cn('transition-transform', !readOnly && 'cursor-pointer hover:scale-110')}
              onMouseEnter={() => !readOnly && setHoverValue(starValue)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              onClick={() => !readOnly && onChange?.(starValue)}
              role={readOnly ? undefined : 'radio'}
              aria-checked={readOnly ? undefined : value === starValue}
              aria-label={readOnly ? undefined : `${starValue} star${starValue > 1 ? 's' : ''}`}
              tabIndex={readOnly ? undefined : 0}
              onKeyDown={(e) => {
                if (!readOnly && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onChange?.(starValue);
                }
              }}
            >
              <StarIcon filled={filled} half={half} />
            </span>
          );
        })}
      </div>
    );
  },
);
Rating.displayName = 'Rating';

export { Rating, ratingVariants };
