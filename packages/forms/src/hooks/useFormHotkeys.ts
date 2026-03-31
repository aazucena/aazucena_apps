'use client';

import { useEffect } from 'react';
import { useFormInstance } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **UX Pattern:** High-productivity hotkey support for technical users.
 * - **Consistency:** Uses standard Cmd/Ctrl + Enter submission pattern.
 * - **Safety:** Only triggers if the form is in a valid state.
 */

/**
 * useFormHotkeys
 * Adds keyboard shortcuts to the form instance.
 * - Cmd + Enter (Mac) / Ctrl + Enter (Win): Submit
 * - Esc: Revert (Optional)
 */
export function useFormHotkeys(options: { submit?: boolean; revert?: boolean } = { submit: true }) {
  const form = useFormInstance();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Submit Shortcut (Cmd/Ctrl + Enter)
      if (options.submit && (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (form.state.canSubmit && !form.state.isSubmitting) {
          e.preventDefault();
          form.handleSubmit();
        }
      }

      // 2. Revert Shortcut (Esc) - Only if enabled and dirty
      if (options.revert && e.key === 'Escape') {
        if (form.state.isDirty && !form.state.isSubmitting) {
          if (window.confirm('Discard all unsaved changes?')) {
            form.reset();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form, options]);
}
