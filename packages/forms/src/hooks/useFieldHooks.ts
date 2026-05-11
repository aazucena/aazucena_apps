'use client';

import { useFormInstance } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **Performance Pattern:** Granular subscriptions via optimized selectors.
 * - **Reactivity:** Minimizes component re-renders by scoping state access.
 */

/**
 * useFormFieldValue
 * Subscribes to and returns the current value of a specific field.
 */
export function useFormFieldValue<TValue = any>(name: string): TValue {
  const form = useFormInstance();
  return (form as any).useStore((state: any) => (state.values as any)[name]);
}

/**
 * useFormFieldMeta
 * Subscribes to and returns the metadata (errors, touched, etc.) of a specific field.
 */
export function useFormFieldMeta(name: string) {
  const form = useFormInstance();
  return (form as any).useStore((state: any) => (state.fieldMeta as any)[name]);
}
