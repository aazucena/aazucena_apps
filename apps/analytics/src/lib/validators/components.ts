import { z } from 'zod';

export const StrapiTagSchema = z.object({
  id: z.number().nullable().optional(),
  label: z.string().max(100),
  color: z.string().optional().nullable(),
});

export type StrapiTag = z.infer<typeof StrapiTagSchema>;
