'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const sliderTrackVariants = cva('relative h-1.5 w-full grow overflow-hidden rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary/20',
      cyber: 'bg-primary/10 dark:bg-signal/10 border border-border/10 dark:border-signal/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const sliderRangeVariants = cva('absolute h-full', {
  variants: {
    variant: {
      default: 'bg-primary',
      cyber: 'bg-primary dark:bg-signal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const sliderThumbVariants = cva(
  'block h-4 w-4 rounded-full border transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-primary/50 bg-background',
        cyber: 'border-signal bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface SliderProps
  extends
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderTrackVariants> {}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, variant, 'aria-label': ariaLabel, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none items-center select-none', className)}
      {...props}
    >
      <SliderPrimitive.Track className={cn(sliderTrackVariants({ variant }))}>
        <SliderPrimitive.Range className={cn(sliderRangeVariants({ variant }))} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={ariaLabel ?? 'Value'}
        className={cn(sliderThumbVariants({ variant }))}
      />
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
