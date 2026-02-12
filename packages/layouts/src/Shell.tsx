import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A React-based inner shell that handles the transition animations.
 */
export const Shell = ({ children, className }: ShellProps) => {
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
