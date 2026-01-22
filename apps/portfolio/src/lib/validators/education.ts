/**
 * Zod validator for Education collection type
 * Validates academic education history with degrees, certifications, and achievements
 */

import { z } from 'zod';
import { WebLinkArraySchema } from './web-link';
import { StrapiSkillSchema } from './skills';
import type { SkillWithCategory } from '~/components/animations/sections/data';

const AchievementSchema = z.object({
  id: z.number().optional(),
  title: z.string().max(100),
  description: z.string().max(300),
  icon: z.string().optional(), // Icons field
  badge: z.any().optional(), // Media object
  date: z.string().optional(),
  sort: z.number().optional(),
});

/**
 * Education type enumeration
 */
export const EducationTypeEnum = z.enum([
  'high-school',
  'diploma',
  'associate',
  'bachelor',
  'master',
  'doctorate',
  'certificate',
  'bootcamp',
  'online-course',
]);

/**
 * Education display enumeration
 */
export const EducationDisplayEnum = z.enum(['hidden', 'standard', 'featured']);

/**
 * Single education entry schema
 */
export const StrapiEducationSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  type: EducationTypeEnum,
  degree: z.string().max(200),
  field: z.string().max(150),
  slug: z.string(),
  institution: z.string().max(200),
  institutionLogo: z
    .object({
      url: z.string(),
      alternativeText: z.string().optional().nullable(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional()
    .nullable(),
  institutionWebsite: z.string().url().max(500).optional().nullable(),
  startDate: z.string(), // ISO date string
  graduationDate: z.string().optional().nullable(), // ISO date string
  expectedGraduationDate: z.string().optional().nullable(), // ISO date string
  current: z.boolean().default(false),
  location: z.string().max(200).optional().nullable(),
  gpa: z.number().min(0).max(5).optional().nullable(),
  gpaScale: z.number().min(0).max(10).default(4),
  description: z.string().max(2000).optional().nullable(),
  honors: z.string().max(200).optional().nullable(),
  thesis: z.string().max(300).optional().nullable(),
  thesisDescription: z.string().max(1000).optional().nullable(),
  sort: z.number().default(0),
  achievements: z.array(AchievementSchema).default([]),
  courses: z.array(z.string()).default([]), // Sortable list
  skills: z.array(StrapiSkillSchema).default([]), // Skills relation (raw Strapi format)
  extracurriculars: z.string().max(1000).optional().nullable(),
  credentialUrl: z.string().url().max(500).optional().nullable(),
  credentialId: z.string().max(100).optional().nullable(),
  featured: z.boolean().default(false),
  display: EducationDisplayEnum,
  relatedLinks: WebLinkArraySchema,
  publishedAt: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});


export const StrapiEducationResponseSchema = z.object({
  data: z.array(StrapiEducationSchema),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }).optional(),
  }).optional(),
});

export type Education = z.infer<typeof StrapiEducationSchema>;
export interface StrapiEducation extends Omit<Education, 'skills'> {
  skills:  (string | SkillWithCategory)[];
}
export type EducationType = z.infer<typeof EducationTypeEnum>;
export type EducationDisplay = z.infer<typeof EducationDisplayEnum>;
