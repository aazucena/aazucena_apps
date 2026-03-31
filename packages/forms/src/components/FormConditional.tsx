'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormInstance } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **Reactivity Pattern:** Declarative conditional rendering via state subscriptions.
 * - **Performance:** Scopes re-renders to just the affected branch of the component tree.
 * - **UX:** Integrated Framer Motion support for smooth visibility transitions.
 */

export interface FormConditionalProps {
  /**
   * Selector function to determine if the children should be rendered.
   * Receives the full form state.
   */
  selector: (state: any) => boolean;
  children: React.ReactNode;
  /**
   * Whether to animate the entrance/exit of the children.
   * @default true
   */
  animate?: boolean;
  className?: string;
}

/**
 * FormConditional
 * Only renders its children if the provided selector function returns true.
 * Automatically subscribes to form state changes.
 */
export function FormConditional({
  selector,
  children,
  animate = true,
  className,
}: FormConditionalProps) {
  const form = useFormInstance() as any;

  return (
    <form.Subscribe selector={selector}>
      {(isVisible: boolean) => (
        <AnimatePresence mode="popLayout">
          {isVisible && (
            <motion.div
              initial={animate ? { opacity: 0, height: 0, y: -10 } : undefined}
              animate={animate ? { opacity: 1, height: 'auto', y: 0 } : undefined}
              exit={animate ? { opacity: 0, height: 0, y: -10 } : undefined}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={className}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </form.Subscribe>
  );
}
