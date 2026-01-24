import { z } from 'zod';
import { ImageElementSchema, SocialLinkSchema } from './components';
import { AvailabilityStatusEnum } from './enums';

export const StrapiPortfolioSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  // Core fields
  fullName: z.string().max(100),
  occupation: z.string().max(200),
  profileImage: ImageElementSchema.nullable().optional(),
  resumeFile: z.any().optional(),
  bio: z.any().nullable().optional(), // Richtext field

  // Contact information
  email: z.string().email(),
  emailDescription: z.string().max(200).nullable().optional(),
  phone: z.string().nullable().optional(),
  preferredContactMethod: z.array(z.string()).optional(),

  // Social & Online Presence
  socialLinks: z.array(SocialLinkSchema).optional(),

  // Professional Information
  yearsOfExperience: z.number().nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  
  // Status and Context
  availabilityStatus: AvailabilityStatusEnum.default("Open to Opportunities"),
  timezone: z.string().default("America/Edmonton"),

  // AI/ML fields
  bioEmbedding: z.any().optional(),
  bioEmbeddingModel: z.string().max(50).nullable().optional(),
  bioEmbeddingGeneratedAt: z.string().nullable().optional(),

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiPortfolio = z.infer<typeof StrapiPortfolioSchema>;