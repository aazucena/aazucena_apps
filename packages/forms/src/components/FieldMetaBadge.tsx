'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormFieldMeta } from '../hooks/useFieldHooks';
import { cn } from '@aazucena/utils';

/**
 * ## Engineering Standards
 * - **Metadata Pattern:** Visualizes internal TanStack field state.
 * - **UX:** Provides granular feedback (modified, validating) at the field level.
 * - **Reactivity:** Uses performance hooks to prevent parent re-renders.
 */

export interface FieldMetaBadgeProps {
  name: string;
  className?: string;
}

/**
 * FieldMetaBadge
 * A small, high-density indicator that shows if a field has been modified
 * or is currently performing async validation.
 */
export function FieldMetaBadge({ name, className }: FieldMetaBadgeProps) {
  const meta = useFormFieldMeta(name);

  if (!meta) return null;

  const isModified = !meta.isPristine;
  const isValidating = meta.isValidating;

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <AnimatePresence>
        {isValidating ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_5px_rgba(6,182,212,0.5)]"
            title="Validating..."
          />
        ) : isModified ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="h-1 w-1 rounded-full bg-amber-500/50"
            title="Modified"
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
