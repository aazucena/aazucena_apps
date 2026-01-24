import { z } from 'zod';
import { ChallengeTypeEnum, RewardTypeEnum } from './enums';

/**
 * Zod schema for Easter Egg Completion from Strapi CMS
 */
export const StrapiEasterEggCompletionSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  userIdentifier: z.string().max(100),
  challengeType: ChallengeTypeEnum,
  keywordFound: z.string().max(100).optional().nullable(),
  pageUrl: z.string().max(500).optional().nullable(),
  completedAt: z.string(), // Datetime ISO string
  userIP: z.string().max(45).optional().nullable(),
  userAgent: z.string().max(500).optional().nullable(),
  timeToComplete: z.number().min(0).optional().nullable(),
  attemptsCount: z.number().min(1).default(1),
  rewardClaimed: z.boolean().default(false),
  rewardType: RewardTypeEnum.optional().nullable(),
  canRetryAt: z.string().optional().nullable(),
  metadata: z.any().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiEasterEggCompletion = z.infer<typeof StrapiEasterEggCompletionSchema>;
