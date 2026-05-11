// apps/analytics/src/hooks/usePrompts.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Prompt } from '@/lib/transformers/prompt';

/**
 * Hook to fetch all AI prompts
 */
export function usePrompts() {
  return useQuery<Prompt[]>({
    queryKey: ['prompts'],
    queryFn: async ({ signal }) => {
      const res = await fetch('/api/prompts', { signal });
      if (!res.ok) throw new Error('FAILED_PROMPTS_FETCH');
      const json = await res.json();
      return json.data;
    },
  });
}

/**
 * Hook to update a specific prompt
 */
export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Prompt> }) => {
      // Map frontend fields back to Strapi naming conventions
      const strapiData = {
        system_message: data.systemMessage,
        human_template: data.humanTemplate,
        description: data.description,
      };

      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(strapiData),
      });

      if (!res.ok) throw new Error('FAILED_PROMPT_UPDATE');
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      // Invalidate the prompts list to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
}
