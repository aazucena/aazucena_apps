/**
 * Zod validator for Education collection type
 */

import { z } from "zod";
import { EducationDisplayEnum, EducationTypeEnum } from "./enums";
import { StrapiProjectSchema } from "./projects";
import {
  AchievementSchema,
  StrapiMediaSchema,
  WebLinkArraySchema,
} from "./components";
import { StrapiSkillSchema } from "./skills";

// Re-export types for backward compatibility
export type { EducationDisplay, EducationType } from "./enums";

/**
 * Explicit Interface for recursion
 */
export interface StrapiEducation {
  id: number;
  documentId?: string;
  type: string;
  degree: string;
  field: string;
  slug: string;
  institution: string;
  institutionLogo?: any | null;
  institutionWebsite?: string | null;
  startDate: string;
  graduationDate?: string | null;
  expectedGraduationDate?: string | null;
  current?: boolean;
  location?: string | null;
  gpa?: number | null;
  gpaScale?: number;
  description?: string | null;
  honors?: string | null;
  thesis?: string | null;
  thesisDescription?: string | null;
  sort?: number;
  achievements?: any[];
  courses?: string[];
  skills?: any[];
  extracurriculars?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  featured?: boolean;
  display?: string;
  relatedLinks?: any[];
  projects?: any[];
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Export Education type for backward compatibility
export type Education = StrapiEducation;

/**
 * Single education entry schema
 */
export const StrapiEducationSchema: z.ZodType<StrapiEducation> = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  type: EducationTypeEnum,
  degree: z.string().max(200),
  field: z.string().max(150),
  slug: z.string(),
  institution: z.string().max(200),
  institutionLogo: StrapiMediaSchema.nullable().optional(),
  institutionWebsite: z.string().url().max(500).optional().nullable(),
  startDate: z.string(),
  graduationDate: z.string().optional().nullable(),
  expectedGraduationDate: z.string().optional().nullable(),
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
  courses: z.array(z.string()).default([]),

  // Relations
  skills: z.array(z.lazy(() => StrapiSkillSchema)).default([]),

  extracurriculars: z.string().max(1000).optional().nullable(),
  credentialUrl: z.string().url().max(500).optional().nullable(),
  credentialId: z.string().max(100).optional().nullable(),
  featured: z.boolean().default(false),
  display: EducationDisplayEnum,
  relatedLinks: WebLinkArraySchema,
  projects: z.array(z.lazy(() => StrapiProjectSchema)).optional(),

  publishedAt: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const StrapiEducationResponseSchema = z.object({
  data: z.array(StrapiEducationSchema),
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

export type StrapiEducationResponse = z.infer<
  typeof StrapiEducationResponseSchema
>;
