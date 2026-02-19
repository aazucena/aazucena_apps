import { z } from 'zod';
import { PromptTypeEnum } from './enums';
import { StrapiTagSchema } from './components';

export const StrapiPromptSchema = z.object({
  id: z.number().nullable().optional(),
  documentId: z.string().nullable().optional(),
  name: z.string().max(255),
  slug: z.string().max(255),
  description: z.string().max(500).nullable().optional(),
  system_message: z.string(),
  human_template: z.string().nullable().optional(),
  type: PromptTypeEnum,
  locale: z.string().nullable().optional(),
  tags: z.array(StrapiTagSchema).optional(),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

export const StrapiPromptsResponseSchema = z.object({
  data: z.array(StrapiPromptSchema),
  meta: z
    .object({
      pagination: z
        .object({
          page: z.number(),
          pageSize: z.number(),
          pageCount: z.number(),
          total: z.number(),
        })
        .optional(),
    })
    .optional(),
});

export type StrapiPrompt = z.infer<typeof StrapiPromptSchema>;
export type StrapiPromptsResponse = z.infer<typeof StrapiPromptsResponseSchema>;
