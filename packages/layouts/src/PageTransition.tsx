import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Move focus to the page when it mounts. Turn this on for client-side route
   * changes, where the browser does not reset focus and a screen reader would
   * otherwise stay on the link that was followed. Leave it off for the first load.
   */
  focusOnMount?: boolean;
}

/**
 * A React-based wrapper that handles page transition animations.
 * Uses `AnimatePresence` to animate page mounts and unmounts.
 */
export const PageTransition = ({
  children,
  className,
  focusOnMount = false,
}: PageTransitionProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (focusOnMount) ref.current?.focus({ preventScroll: true });
  }, [focusOnMount]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        tabIndex={focusOnMount ? -1 : undefined}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn('min-h-screen flex flex-col focus:outline-none', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
