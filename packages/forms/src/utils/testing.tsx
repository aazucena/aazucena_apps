'use client';

import * as React from 'react';
import { useForm, type FormOptions } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form, FormInstanceContext } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Testing Pattern:** Standardized harness for headless and UI-based form testing.
 * - **Consistency:** Injects the design-system providers automatically.
 * - **Readiness:** Prepares the package for Phase 5 (Testing) without adding dev-dependencies.
 */

/**
 * createFormTestHarness
 * A utility for Vitest/Testing-Library that provides a fully-wrapped form environment.
 *
 * @example
 * const { wrapper } = createFormTestHarness({ defaultValues: { name: '' } });
 * render(<MyField />, { wrapper });
 */
export function createFormTestHarness<TData>(
  options: Partial<FormOptions<TData, any, any, any, any, any, any, any, any, any, any>> = {},
) {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useForm({
      validatorAdapter: zodValidator(),
      ...options,
    } as any);

    return (
      <FormInstanceContext.Provider value={form}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {children}
        </Form>
      </FormInstanceContext.Provider>
    );
  };

  return {
    wrapper: TestWrapper,
  };
}
