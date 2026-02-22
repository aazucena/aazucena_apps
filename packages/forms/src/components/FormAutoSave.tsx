'use client';

import * as React from 'react';
import { useFormInstance } from '../utils/composables.js';

/**
 * ## Engineering Standards
 * - **UX Pattern:** Automated data persistence via debounced subscriptions.
 * - **Performance:** Uses store.subscribe to avoid React re-renders.
 * - **Efficiency:** Only triggers when the form is dirty and valid.
 */

export interface FormAutoSaveProps {
  /**
   * Callback fired when the debounced save is triggered.
   */
  onSave: (values: any) => Promise<void> | void;
  /**
   * Time in milliseconds to wait after the last change before saving.
   * @default 2000
   */
  debounceMs?: number;
}

/**
 * FormAutoSave
 * An invisible component that automatically saves form progress.
 * Intelligently waits for the user to stop typing and ensures the form is valid.
 */
export function FormAutoSave({ onSave, debounceMs = 2000 }: FormAutoSaveProps) {
  const form = useFormInstance();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Subscribe to form state changes
    const unsubscribe = form.store.subscribe(() => {
      const state = form.state;

      // Only auto-save if the form is modified and currently valid
      if (state.isDirty && state.isValid && !state.isSubmitting) {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
          try {
            await onSave(state.values);
            // Optionally: Mark as pristine after save if your logic requires it
            // form.reset(state.values); 
          } catch (e) {
            console.error('[FormAutoSave] Failed to auto-save:', e);
          }
        }, debounceMs);
      }
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, onSave, debounceMs]);

  return null;
}
