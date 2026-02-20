import { z } from "zod";
import { PerformanceTierEnum } from "./enums";

/**
 * Zod schema for Animation System from Strapi CMS
 */
export const StrapiAnimationSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  enabled: z.boolean(),
  heavyAnimations: z.boolean(),
  defaultPerformanceTier: PerformanceTierEnum,
  particleCountLow: z.number().min(0).max(100).optional(),
  particleCountMedium: z.number().min(0).max(200).optional(),
  particleCountHigh: z.number().min(0).max(500).optional(),
  timingFlipText: z.number().min(1000).max(10000).optional(),
  timingSectionTransition: z.number().min(100).max(5000).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiAnimation = z.infer<typeof StrapiAnimationSchema>;
