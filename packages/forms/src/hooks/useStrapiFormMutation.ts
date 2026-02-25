'use client';

import { fetchStrapi } from '@aazucena/api';
import { useFormMutation, type UseFormMutationOptions } from './useFormMutation.js';

/**
 * useStrapiFormMutation
 * A pre-configured mutation hook specifically for Strapi v5 submissions.
 * Separated from `useFormMutation` so non-Strapi apps don't incur the
 * `@aazucena/api` dependency.
 */
export function useStrapiFormMutation<TData>(
  collection: string,
  options: Omit<UseFormMutationOptions<any, any, TData, any>, 'mutationFn'> & {
    method?: 'POST' | 'PATCH';
  },
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
  });
}
