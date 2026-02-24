import { z } from 'zod';

// =============================================================================
// ACCOUNT SCHEMAS
// =============================================================================

/**
 * Profile Schema (user account profile settings)
 */
export const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(80),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  socialLinks: z.object({
    github: z.string().optional(),
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().optional(),
  }).optional(),
  timezone: z.string().min(1, 'Timezone is required').default('UTC'),
  preferredTheme: z.enum(['light', 'dark', 'system']).default('system'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// =============================================================================
// ACCOUNT (NEW — Phase 1 expansion)
// =============================================================================

/**
 * Notification Preferences Schema
 */
export const notificationPrefsSchema = z.object({
  marketing: z.boolean().default(false),
  security: z.boolean().default(true),
  product: z.boolean().default(true),
  social: z.boolean().default(false),
  frequency: z.enum(['immediate', 'daily', 'weekly']).default('immediate'),
  emailEnabled: z.boolean().default(true),
  pushEnabled: z.boolean().default(false),
  inAppEnabled: z.boolean().default(true),
});

/**
 * Privacy Settings Schema
 */
export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'connections']).default('public'),
  analyticsConsent: z.boolean().default(false),
  personalizedAds: z.boolean().default(false),
  dataSharingPartners: z.boolean().default(false),
  activityStatus: z.boolean().default(true),
});

/**
 * Connected Apps Schema
 */
export const connectedAppsSchema = z.object({
  provider: z.enum(['google', 'github', 'slack', 'notion', 'linear', 'jira', 'figma']),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
  revokeOnSave: z.boolean().default(false),
});

/**
 * Account Deletion Schema
 */
export const accountDeletionSchema = z.object({
  reason: z.enum(['no_longer_needed', 'switching_service', 'privacy_concerns', 'too_expensive', 'other']),
  otherReason: z.string().max(500).optional(),
  confirmEmail: z.string().email('Please enter your account email'),
  exportDataFirst: z.boolean().default(false),
  acknowledgeIrreversible: z.boolean().refine((v) => v === true, 'You must acknowledge this action is irreversible'),
});

export type NotificationPrefsFormData = z.infer<typeof notificationPrefsSchema>;
export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>;
export type ConnectedAppsFormData = z.infer<typeof connectedAppsSchema>;
export type AccountDeletionFormData = z.infer<typeof accountDeletionSchema>;
