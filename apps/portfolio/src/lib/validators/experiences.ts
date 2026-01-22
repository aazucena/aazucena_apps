import { z } from 'zod';
import { WebLinkArraySchema } from './web-link';
import { StrapiSkillSchema } from './skills';

// Image Element component schema
const ImageElementSchema = z.object({
  src: z.any(), // Media object
  altText: z.string().max(150),
}).nullish(); // Allow null or undefined

// Achievement component schema (matches content.achievement)
const AchievementSchema = z.object({
  id: z.number().optional(),
  title: z.string().max(100),
  description: z.string().max(300),
  icon: z.string().optional(), // Icons field
  badge: z.any().optional(), // Media object
  date: z.string().optional(),
  sort: z.number().optional(),
});

export const StrapiExperienceSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  slug: z.string().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  // Core fields
  company: z.string().max(150),
  position: z.string().max(150),
  companyLogo: ImageElementSchema,

  // Company metadata
  industry: z.enum([
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Entertainment',
    'Retail',
    'Manufacturing',
    'Government',
    'Non-Profit',
    'Startup',
    'Food & Beverage',
    'Oil & Gas',
    'Media'
  ]).optional(),
  companySize: z.enum([
    'startup',
    'small',
    'medium',
    'midsize',
    'large',
    'enterprise',
    'global'
  ]).optional(),
  location: z.string().max(150).optional(),

  // Date fields
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),

  // Content fields
  description: z.any(), // Richtext (required in Strapi)
  responsibilities: z.any().optional(), // Richtext

  // Employment details
  employmentType: z.enum([
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Co-op'
  ]).optional(),
  workMode: z.enum([
    'Onsite',
    'Hybrid',
    'Remote'
  ]).optional(),
  companyWebsite: z.string().max(255).nullable().optional(),
  companyLinkedIn: z.string().max(255).nullable().optional(),

  // Relations and components
  skillsUsed: z.array(StrapiSkillSchema).optional(), // Skills relation (raw Strapi format)
  achievements: z.array(AchievementSchema).optional(),
  projects: z.array(z.object({
    id: z.number(),
    documentId: z.string().optional(),
    title: z.string(),
    slug: z.string(),
    shortDescription: z.string().optional(),
  })).optional(), // OneToMany relation to Project
  relatedLinks: WebLinkArraySchema, // Web link components

  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiExperiencesResponseSchema = z.object({
  data: z.array(StrapiExperienceSchema),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }).optional(),
  }).optional(),
});

export type StrapiExperience = z.infer<typeof StrapiExperienceSchema>;
export type StrapiExperiencesResponse = z.infer<typeof StrapiExperiencesResponseSchema>;
