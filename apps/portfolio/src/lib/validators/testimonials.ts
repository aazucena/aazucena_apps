import { z } from 'zod';

export const StrapiTestimonialSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  author: z.string().max(200),
  authorTitle: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  content: z.string(),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  avatar: z.object({
    src: z.any(),
    altText: z.string(),
  }).optional(),
  companyLogo: z.any().optional(),
  relationship: z.enum(['client', 'colleague', 'manager', 'other']).optional(),
  projectRelated: z.any().optional(),
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
  aiSentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  aiSummary: z.string().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiTestimonialsResponseSchema = z.object({
  data: z.array(StrapiTestimonialSchema),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }).optional(),
  }).optional(),
});

export type StrapiTestimonial = z.infer<typeof StrapiTestimonialSchema>;
export type StrapiTestimonialsResponse = z.infer<typeof StrapiTestimonialsResponseSchema>;
