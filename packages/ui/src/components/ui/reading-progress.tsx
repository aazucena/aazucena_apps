'use client';

import * as React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const readingProgressVariants = cva(
  'fixed top-0 right-0 left-0 z-(--z-fixed) h-1 origin-left transition-all duration-300 print:hidden',
  {
    variants: {
      variant: {
        default: '',
        glass: 'bg-panel-raised',
        cyber: 'bg-signal',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ReadingProgressProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof readingProgressVariants> {}

const ReadingProgress = React.forwardRef<HTMLDivElement, ReadingProgressProps>(
  ({ className, variant, ...props }, ref) => {
    const { scrollYProgress } = useScroll();
    const smoothed = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    });
    // Under reduced motion the bar tracks the scroll position directly, without spring easing.
    const scaleX = useReducedMotion() ? scrollYProgress : smoothed;

    // Omit motion-conflicting props
    const {
      onDrag: _onDrag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      ...cleanProps
    } = props as any;

    return (
      <motion.div
        ref={ref}
        className={cn(readingProgressVariants({ variant }), className)}
        style={{ scaleX }}
        {...cleanProps}
      />
    );
  },
);
ReadingProgress.displayName = 'ReadingProgress';

export { ReadingProgress, readingProgressVariants };
