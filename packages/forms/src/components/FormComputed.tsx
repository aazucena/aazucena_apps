'use client';

import * as React from 'react';
import { useFormInstance } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **Derived State Pattern:** Computes UI-only information from form values.
 * - **Performance:** Only re-renders when the specific dependencies change.
 * - **Clean Data:** Keeps computed/virtual values out of the actual submission payload.
 */

export interface FormComputedProps<TDerived> {
  /**
   * Selector to derive the computed value from the form state.
   */
  selector: (state: any) => TDerived;
  /**
   * Render function that receives the computed value.
   */
  children: (value: TDerived) => React.ReactNode;
}

/**
 * FormComputed
 * A component for rendering derived/virtual state that isn't stored in the form.
 * Useful for totals, progress meters, or dynamic previews.
 */
export function FormComputed<TDerived>({ selector, children }: FormComputedProps<TDerived>) {
  const form = useFormInstance() as any;

  return (
    <form.Subscribe selector={selector}>{(value: TDerived) => children(value)}</form.Subscribe>
  );
}
