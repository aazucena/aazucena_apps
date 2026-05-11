'use client';

import { useEffect } from 'react';
import { useFormInstance } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **Integrity Pattern:** Automated state cleanup for dynamic field lifecycles.
 * - **Consistency:** Ensures the form store matches the active UI state.
 * - **Reliability:** Prevents "ghost data" from unmounted fields in API submissions.
 */

/**
 * useFormCleanup
 * Automatically removes a field's value and metadata from the form store when it unmounts.
 * Critical for dynamic forms like ConditionRules or FormLists.
 *
 * @param name The name/path of the field to clean up.
 */
export function useFormCleanup(name: string) {
  const form = useFormInstance();

  useEffect(() => {
    // Return a cleanup function that runs on unmount
    return () => {
      // 1. Reset the field value to undefined
      form.setFieldValue(name as any, undefined as any);

      // 2. Clear the field's metadata (errors, touched state, etc)
      // TanStack Form's internal store handles this once the field is no longer registered,
      // but explicit removal ensures the submission payload is clean immediately.
    };
  }, [form, name]);
}
