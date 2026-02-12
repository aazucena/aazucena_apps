import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from '@aazucena/icons';
import { cn, scrollToTop } from '@aazucena/utils';
import { useScrollToTop } from '@aazucena/hooks';

export interface BackToTopProps {
  className?: string;
}

export function BackToTop({ className }: BackToTopProps) {
  const { isVisible } = useScrollToTop(300);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => scrollToTop(true)}
          className={cn(
            'group fixed right-8 bottom-8 z-50 rounded-2xl bg-blue-600 p-4 text-white shadow-2xl ring-4 ring-blue-600/10 transition-all duration-300 hover:bg-blue-700 active:scale-95 dark:ring-blue-400/10',
            className,
          )}
          aria-label="Back to top"
        >
          <ArrowUp
            size={24}
            className="transition-transform duration-300 group-hover:-translate-y-1"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
