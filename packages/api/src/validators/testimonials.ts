import { z } from 'zod';
import { ImageElementSchema } from './components';
import { RelationshipEnum, ApprovalStatusEnum, SentimentEnum } from '@aazucena/types';

export const StrapiTestimonialSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  author: z.string().max(100),
  authorTitle: z.string().max(150).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  content: z.string().max(1000),
  avatar: ImageElementSchema.nullable().optional(),
  rating: z.number().min(1).max(5).default(5),
  featured: z.boolean().default(false),
  relationship: RelationshipEnum.optional().nullable(),
  approvalStatus: ApprovalStatusEnum.optional().nullable(),
  approvedBy: z.string().max(100).optional().nullable(),
  approvedAt: z.string().optional().nullable(),
  rejectionReason: z.string().max(500).optional().nullable(),
  submittedAt: z.string().optional().nullable(),
  authorEmail: z.string().email().optional().nullable(),
  authorLinkedIn: z.string().max(255).optional().nullable(),
  contentEmbedding: z.any().optional().nullable(),
  aiSentiment: SentimentEnum.optional().nullable(),
  aiTags: z.any().optional().nullable(),

  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiTestimonialsResponseSchema = z.object({
  data: z.array(StrapiTestimonialSchema),
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

export type StrapiTestimonial = z.infer<typeof StrapiTestimonialSchema>;
export type StrapiTestimonialsResponse = z.infer<typeof StrapiTestimonialsResponseSchema>;
