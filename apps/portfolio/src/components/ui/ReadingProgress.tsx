/**
 * ReadingProgress.tsx
 * A minimalist progress bar fixed to the top of the viewport
 * indicating reading position.
 */

import { motion, useScroll, useSpring } from 'framer-motion';
import type { JSX } from 'react';

export function ReadingProgress(): JSX.Element {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50 print:hidden"
      style={{ scaleX }}
    />
  );
}
