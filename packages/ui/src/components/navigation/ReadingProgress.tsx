/**
 * ReadingProgress.tsx
 * A minimalist progress bar fixed to the top of the viewport
 * indicating reading position.
 */

import { motion, useScroll, useSpring } from 'framer-motion';
import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps): JSX.Element {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        'fixed top-0 right-0 left-0 z-50 h-1 origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 print:hidden',
        className,
      )}
      style={{ scaleX }}
    />
  );
}
