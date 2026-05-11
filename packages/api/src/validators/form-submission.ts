import { z } from 'zod';
import { FormTypeEnum, SentimentEnum, SubmissionStatusEnum } from '@aazucena/types';

/**
 * Zod schema for Form Submission from Strapi CMS
 */
export const StrapiFormSubmissionSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  formType: FormTypeEnum,
  rawMessage: z.string().max(5000),
  formData: z.any().optional().nullable(),
  structuredData: z.any().optional().nullable(),
  aiIntent: z.string().max(100).optional().nullable(),
  aiSummary: z.string().max(1000).optional().nullable(),
  aiSentiment: SentimentEnum.default('Neutral'),
  aiTags: z.any().optional().nullable(),
  easterEggDetected: z.boolean().default(false),
  submittedAt: z.string(), // Datetime string
  submitterIP: z.string().max(45).optional().nullable(),
  submitterEmail: z.string().email().optional().nullable(),
  submitterName: z.string().max(100).optional().nullable(),
  recaptchaScore: z.number().min(0).max(1).optional().nullable(),
  status: SubmissionStatusEnum.default('New'),
  assignedTo: z.string().max(100).optional().nullable(),
  internalNotes: z.string().max(2000).optional().nullable(),
  langSmithTraceId: z.string().max(100).optional().nullable(),
  messageEmbedding: z.any().optional().nullable(),
  summaryEmbedding: z.any().optional().nullable(),
  embeddingModel: z.string().max(50).default('gemini-textembedding-gecko'),
  embeddingGeneratedAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiFormSubmission = z.infer<typeof StrapiFormSubmissionSchema>;
