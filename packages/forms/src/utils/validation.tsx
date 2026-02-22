'use client';

import { type FormApi } from '@tanstack/react-form';

/**
 * ## Engineering Standards
 * - **Validation Pattern:** Standardized factory for asynchronous field validation.
 * - **UX:** Built-in debouncing to prevent excessive API calls and UI flickering.
 * - **Flexibility:** Supports returning booleans (with default messages) or custom error strings.
 */

export interface AsyncValidatorOptions {
  debounceMs?: number;
  message?: string;
}

/**
 * createAsyncValidator
 * A reusable factory for TanStack Form async validators.
 */
export function createAsyncValidator<TValue>(
  checkFn: (value: TValue) => Promise<boolean | string | undefined>,
  options: AsyncValidatorOptions = {}
) {
  const { debounceMs = 500, message = 'Invalid value' } = options;

  return {
    onChangeAsyncDebounceMs: debounceMs,
    onChangeAsync: async ({ value }: { value: TValue }) => {
      if (value === undefined || value === null || (typeof value === 'string' && value === '')) {
        return undefined;
      }

      try {
        const result = await checkFn(value);
        if (typeof result === 'string') return result;
        if (result === false) return message;
        return undefined;
      } catch (error) {
        console.error('[AsyncValidator] Validation failed:', error);
        return 'Validation service unavailable';
      }
    },
  };
}

/**
 * createInputTransformer
 * Intercepts field changes to transform the value before it is stored.
 */
export function createInputTransformer<TValue>(
  field: { handleChange: (val: TValue) => void },
  transformFn: (value: TValue) => TValue
) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawValue = e.target.value as unknown as TValue;
    field.handleChange(transformFn(rawValue));
  };
}

/**
 * createComparisonValidator
 * Creates a validator that compares the current field value against another field.
 */
export function createComparisonValidator<TValue>(
  otherFieldName: string,
  compareFn: (value: TValue, otherValue: any) => boolean,
  message: string
) {
  return ({ value, fieldApi }: { value: TValue; fieldApi: any }) => {
    const otherValue = fieldApi.form.getFieldValue(otherFieldName);
    if (!compareFn(value, otherValue)) {
      return message;
    }
    return undefined;
  };
}

/**
 * getFormChanges
 * Iterates through the form state and returns only the fields that have been modified.
 * Essential for efficient PATCH requests to Strapi v5.
 */
export function getFormChanges<TData>(form: FormApi<TData, any, any, any, any, any, any, any, any, any, any, any>): Partial<TData> {
  const changes: any = {};
  const { values, fieldMeta } = form.state;

  Object.keys(fieldMeta).forEach((path) => {
    const meta = (fieldMeta as any)[path];
    if (!meta.isPristine) {
      // In a real implementation, we would use lodash.get/set or similar
      // to correctly map nested paths. For now, we assume top-level or handled by TanStack.
      changes[path] = (values as any)[path];
    }
  });

  return changes;
}
