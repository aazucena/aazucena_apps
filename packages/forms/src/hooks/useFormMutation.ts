'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { FormApi } from '@tanstack/react-form';

/**
 * ## Engineering Standards
 * - **Mutation Pattern:** Official TanStack bridge between Form logic and Query side-effects.
 * - **Full-Stack Integrity:** Automatically maps server-side validation errors back to form fields.
 */

export interface UseFormMutationOptions<
  TData,
  TError,
  TVariables,
  TContext,
> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  form: FormApi<any, any, any, any, any, any, any, any, any, any, any, any>;
  mapServerErrors?: (error: TError) => Record<string, string>;
}

/**
 * useFormMutation
 * Bridges a TanStack Form instance with a TanStack Query mutation.
 * Accepts any `mutationFn` — pass your own fetch call (Strapi, REST, GraphQL, etc.).
 */
export function useFormMutation<TData, TError, TVariables, TContext>(
  options: UseFormMutationOptions<TData, TError, TVariables, TContext>,
) {
  const { form, mapServerErrors, ...mutationOptions } = options;

  return useMutation({
    ...mutationOptions,
    onError: (err, variables, context) => {
      if (mapServerErrors) {
        const fieldErrors = mapServerErrors(err);
        Object.entries(fieldErrors).forEach(([field, message]) => {
          form.setFieldMeta(field as any, (meta) => ({ ...meta, errors: [message] }));
        });
      }
      if (mutationOptions.onError) {
        (mutationOptions.onError as any)(err, variables, context);
      }
    },
  });
}
