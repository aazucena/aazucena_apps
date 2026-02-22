'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { FormApi } from '@tanstack/react-form';
import { fetchStrapi } from '@aazucena/api';

/**
 * ## Engineering Standards
 * - **Mutation Pattern:** Official TanStack bridge between Form logic and Query side-effects.
 * - **Full-Stack Integrity:** Automatically maps server-side validation errors back to form fields.
 */

export interface UseFormMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  form: FormApi<any, any, any, any, any, any, any, any, any, any, any, any>;
  mapServerErrors?: (error: TError) => Record<string, string>;
}

/**
 * useFormMutation
 * Bridges a TanStack Form instance with a TanStack Query mutation.
 */
export function useFormMutation<TData, TError, TVariables, TContext>(
  options: UseFormMutationOptions<TData, TError, TVariables, TContext>
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

/**
 * useStrapiFormMutation
 * A pre-configured mutation hook specifically for Strapi v5 submissions.
 */
export function useStrapiFormMutation<TData>(
  collection: string,
  options: Omit<UseFormMutationOptions<any, any, TData, any>, 'mutationFn'> & { method?: 'POST' | 'PATCH' }
) {
  const { method = 'POST', ...rest } = options;

  return useFormMutation({
    ...rest,
    mutationFn: async (payload: TData) => {
      return fetchStrapi(collection, {
        method,
        body: JSON.stringify({ data: payload }),
      });
    },
    // Default Strapi error mapper can be added here
  });
}
