'use client';

import { useEffect } from 'react';
import { useFormInstance } from '../utils/composables.js';

/**
 * ## Engineering Standards
 * - **UX Pattern:** Prevents data loss by guarding against accidental navigation.
 * - **Reliability:** Integrates with the browser's native beforeunload event.
 * - **Consistency:** Uses TanStack Form's internal isDirty state.
 */

/**
 * useFormDirtyGuard
 * Prevents the user from leaving the page if the form has unsaved changes.
 */
export function useFormDirtyGuard(enabled = true) {
  const form = useFormInstance();

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.state.isDirty && !form.state.isSubmitting) {
        e.preventDefault();
        e.returnValue = ''; // Standard browser prompt
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form, enabled]);

  return {
    isDirty: form.state.isDirty,
  };
}

/**
 * ## Engineering Standards
 * - **Accessibility Pattern:** WCAG-compliant error identification and focus management.
 * - **UX:** Reduces cognitive load by scrolling directly to the first failure point.
 */

/**
 * useFormErrorFocus
 * Automatically scrolls to and focuses the first invalid field after a failed submission attempt.
 */
export function useFormErrorFocus() {
  const form = useFormInstance();

  useEffect(() => {
    // Subscribe to submission attempts
    const unsubscribe = form.store.subscribe(() => {
      const state = form.state;

      // Only trigger if a submission was attempted and failed with errors
      if (state.submissionAttempts > 0 && !state.isSubmitting && !state.isValid) {
        // 1. Find the first field with an error
        const firstErrorField = Object.keys(state.fieldMeta).find(
          (key) => (state.fieldMeta as any)[key]?.errors.length > 0,
        );

        if (firstErrorField) {
          // 2. Locate the element (matching the ID pattern in @aazucena/ui/form.tsx)
          // We look for the standard ID pattern used by useId() + '-form-item'
          // However, since we can't know the exact random ID, we look for the name attribute
          const element =
            document.getElementsByName(firstErrorField)[0] ||
            document.querySelector(`[id*="${firstErrorField}"]`);

          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // If it's focusable, focus it
            if (element instanceof HTMLElement) {
              element.focus({ preventScroll: true });
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, [form]);
}
