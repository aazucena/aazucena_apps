'use client';

import * as React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const readingProgressVariants = cva(
  'fixed top-0 right-0 left-0 z-50 h-1 origin-left transition-all duration-300 print:hidden',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
        glass: 'bg-white/30 backdrop-blur-sm',
        cyber: 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]',
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
    const scaleX = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    });

    // Omit motion-conflicting props
    const { onDrag, onDragStart, onDragEnd, ...cleanProps } = props as any;

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
