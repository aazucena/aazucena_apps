import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A React-based wrapper that handles page transition animations.
 * Uses `AnimatePresence` to animate page mounts and unmounts.
 */
export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn('min-h-screen flex flex-col', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
