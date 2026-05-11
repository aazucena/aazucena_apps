import { z } from 'zod';

// =============================================================================
// ONBOARDING SCHEMAS
// =============================================================================

/**
 * Onboarding Schema (multi-step)
 */
export const onboardingSchema = z.object({
  // Step 1: Profile
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(80),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  // Step 2: Preferences
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.boolean().default(true),
  newsletter: z.boolean().default(false),
  // Step 3: Integrations
  githubHandle: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
});

/**
 * Waitlist Schema
 */
export const waitlistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  referralCode: z.string().optional(),
});

/**
 * Subscription Schema (Newsletter/content)
 */
export const subscriptionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  contentPreferences: z.array(z.string()).min(1, 'Select at least one topic'),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type WaitlistFormData = z.infer<typeof waitlistSchema>;
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

// =============================================================================
// ONBOARDING (NEW — Phase 1 expansion)
// =============================================================================

/**
 * Team Onboarding Schema (3-step: org → invite → integrations)
 */
export const teamOnboardingSchema = z.object({
  orgName: z.string().min(2, 'Organization name is required').max(100),
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),
  inviteEmails: z.string().min(1, 'Enter at least one email'),
  roles: z.enum(['viewer', 'editor', 'admin']).default('editor'),
  slackIntegration: z.boolean().default(false),
  teamsIntegration: z.boolean().default(false),
  emailIntegration: z.boolean().default(true),
});

/**
 * Goal Setting Schema
 */
export const goalSettingSchema = z.object({
  primaryGoal: z.enum(['ship_faster', 'reduce_bugs', 'improve_dx', 'grow_team', 'save_costs']),
  secondaryGoals: z.array(z.string()).optional(),
  timeline: z.enum(['30d', '90d', '6mo', '1yr']).default('90d'),
  successMetric: z.string().min(5, 'Please describe your success metric').max(500),
  reminderFrequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
});

/**
 * Import Data Schema (2-step: source → mapping)
 */
export const importDataSchema = z.object({
  sourceSystem: z.enum(['csv', 'json', 'postgres', 'mysql', 'airtable', 'notion', 'sheets']),
  apiKey: z.string().optional(),
  fieldMapping: z.string().max(2000).optional(),
  conflictResolution: z.enum(['skip', 'overwrite', 'merge']).default('skip'),
});

/**
 * Integration Setup Schema
 */
export const integrationSetupSchema = z.object({
  integration: z.enum(['GitHub', 'Slack', 'Jira', 'Notion', 'Linear']),
  authMethod: z.enum(['oauth', 'token']).default('oauth'),
  webhookUrl: z.string().url().optional().or(z.literal('')),
  syncDirection: z.enum(['one_way', 'two_way']).default('one_way'),
  syncFrequency: z.enum(['realtime', 'hourly', 'daily']).default('realtime'),
});

export type TeamOnboardingFormData = z.infer<typeof teamOnboardingSchema>;
export type GoalSettingFormData = z.infer<typeof goalSettingSchema>;
export type ImportDataFormData = z.infer<typeof importDataSchema>;
export type IntegrationSetupFormData = z.infer<typeof integrationSetupSchema>;
