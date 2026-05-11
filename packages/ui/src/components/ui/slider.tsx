'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const sliderTrackVariants = cva(
  'relative h-1.5 w-full grow overflow-hidden rounded-full transition-all',
  {
    variants: {
      variant: {
        default: 'bg-primary/20',
        cyber: 'bg-primary/10 dark:bg-cyan-500/10 border border-border/10 dark:border-cyan-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const sliderRangeVariants = cva('absolute h-full transition-all', {
  variants: {
    variant: {
      default: 'bg-primary',
      cyber: 'bg-primary dark:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const sliderThumbVariants = cva(
  'block h-4 w-4 rounded-full border shadow transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-primary/50 bg-background',
        cyber: 'border-cyan-400 bg-background dark:bg-black shadow-[0_0_10px_rgba(6,182,212,0.4)]',
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
  ({ className, variant, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none items-center select-none', className)}
      {...props}
    >
      <SliderPrimitive.Track className={cn(sliderTrackVariants({ variant }))}>
        <SliderPrimitive.Range className={cn(sliderRangeVariants({ variant }))} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={cn(sliderThumbVariants({ variant }))} />
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
