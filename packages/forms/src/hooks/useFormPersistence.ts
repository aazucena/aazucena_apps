'use client';

import { useEffect, useRef } from 'react';
import type { FormApi } from '@tanstack/react-form';

/**
 * ## Engineering Standards
 * - **Persistence Pattern:** Automated synchronization of form state to localStorage.
 * - **Reliability:** Prevents data loss on accidental refreshes or navigation.
 * - **Performance:** Uses a ref to prevent unnecessary effect re-runs.
 */

export interface FormPersistenceOptions {
  /**
   * The unique key used to store the form data in localStorage.
   */
  key: string;
  /**
   * Whether to automatically clear the storage after a successful submission.
   * @default true
   */
  clearOnSubmit?: boolean;
  /**
   * Optional transform function to apply before saving (e.g., to strip sensitive data).
   */
  onSave?: (values: any) => any;
}

/**
 * useFormPersistence
 * A reusable hook that synchronizes a TanStack Form instance with localStorage.
 */
export function useFormPersistence<TData>(
  form: FormApi<TData, any, any, any, any, any, any, any, any, any, any, any>,
  options: FormPersistenceOptions,
) {
  const { key, clearOnSubmit = true, onSave } = options;
  const isInitialMount = useRef(true);

  // 1. Load data from storage on mount
  useEffect(() => {
    if (!isInitialMount.current) return;

    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.setFieldValue('' as any, parsed); // Set root value
      } catch (e) {
        console.error(`[FormPersistence] Failed to parse saved data for key: ${key}`, e);
      }
    }
    isInitialMount.current = false;
  }, [form, key]);

  // 2. Subscribe to changes and save to storage
  useEffect(() => {
    // Subscribe to form store changes
    const subscription = form.store.subscribe(() => {
      const values = onSave ? onSave(form.state.values) : form.state.values;
      localStorage.setItem(key, JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [form, key, onSave]);

  // 3. Optional: Cleanup on successful submission
  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      const state = form.state;
      if (clearOnSubmit && state.isSubmitted && !state.isSubmitting) {
        localStorage.removeItem(key);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, key, clearOnSubmit]);
}
