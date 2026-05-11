'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const swapVariants = cva('relative inline-flex cursor-pointer items-center justify-center', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

export interface SwapProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof swapVariants> {
  active?: boolean;
  onSwap?: (active: boolean) => void;
  rotate?: boolean;
  flip?: boolean;
  on: React.ReactNode;
  off: React.ReactNode;
}

const Swap = React.forwardRef<HTMLDivElement, SwapProps>(
  (
    { className, variant, size, active: controlledActive, onSwap, rotate, flip, on, off, ...props },
    ref,
  ) => {
    const [internalActive, setInternalActive] = React.useState(false);
    const isControlled = controlledActive !== undefined;
    const active = isControlled ? controlledActive : internalActive;

    const handleClick = () => {
      const next = !active;
      if (!isControlled) setInternalActive(next);
      onSwap?.(next);
    };

    const transitionClass = rotate
      ? 'transition-transform duration-300'
      : flip
        ? 'transition-transform duration-300'
        : 'transition-opacity duration-200';

    const activeTransform = rotate ? 'rotate-180' : flip ? 'scale-x-0' : 'opacity-0';

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={cn(swapVariants({ variant, size }), className)}
        {...props}
      >
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            transitionClass,
            active && activeTransform,
            active && !rotate && !flip && 'pointer-events-none',
          )}
        >
          {off}
        </div>
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            transitionClass,
            !active && activeTransform,
            !active && !rotate && !flip && 'pointer-events-none',
          )}
        >
          {on}
        </div>
      </div>
    );
  },
);
Swap.displayName = 'Swap';

export { Swap, swapVariants };
