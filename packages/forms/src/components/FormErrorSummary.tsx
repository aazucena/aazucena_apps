'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { useFormInstance } from '../utils/composables.js';

/**
 * ## Engineering Standards
 * - **Accessibility Pattern:** WCAG-compliant aggregated error reporting for complex forms.
 * - **UX:** Provides a single "Jump-to" point for all active validation failures.
 * - **Design:** Cyber-aware styling with high-visibility alert iconography.
 */

export interface FormErrorSummaryProps {
  className?: string;
  /**
   * Title for the error summary block.
   * @default 'System_Validation_Failure'
   */
  title?: string;
}

/**
 * FormErrorSummary
 * A high-visibility block that aggregates all current form validation errors.
 * Best used at the top of long forms to provide immediate feedback.
 */
export function FormErrorSummary({
  className,
  title = 'System_Validation_Failure',
}: FormErrorSummaryProps) {
  const form = useFormInstance() as any;

  return (
    <form.Subscribe
      selector={(state: any) => {
        // Extract all errors from fieldMeta
        return Object.entries(state.fieldMeta)
          .filter(([_, meta]) => (meta as any).errors.length > 0)
          .map(([name, meta]) => ({
            field: name,
            message: (meta as any).errors[0],
          }));
      }}
    >
      {(errors: any[]) => (
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className={cn(
                'mb-6 overflow-hidden rounded-xl border border-destructive/20 bg-destructive/5 p-4',
                className,
              )}
            >
              <div className="flex items-center gap-2 mb-3 text-destructive">
                <Shield size={18} className="shrink-0" />
                <h4 className="text-xs font-black uppercase tracking-tighter leading-none">
                  {title} ({errors.length})
                </h4>
              </div>

              <ul className="space-y-1.5 pl-6 list-disc">
                {errors.map((err: any) => (
                  <li key={err.field} className="text-xs text-destructive/80 font-medium">
                    <span className="font-mono uppercase opacity-50 mr-1">
                      {err.field.replace(/\[\d+\]/g, '')}:
                    </span>
                    {String(err.message)}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </form.Subscribe>
  );
}
