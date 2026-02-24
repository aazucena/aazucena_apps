import { z } from 'zod';

// =============================================================================
// OPEN SOURCE / DEVELOPER SCHEMAS
// =============================================================================

/**
 * PR Request Schema
 */
export const prRequestSchema = z.object({
  repository: z.string().min(2, 'Repository is required').max(200),
  title: z.string().min(5, 'PR title is required').max(200),
  branch: z.string().min(2, 'Branch name is required').max(100),
  description: z.string().min(20, 'Please describe your changes').max(5000),
  relatedIssues: z.string().max(500).optional(),
  hasTests: z.boolean().default(false),
  hasDocs: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
});

/**
 * Contributions Schema (OSS contribution)
 */
export const contributionsSchema = z.object({
  // Step 1: Contributor info
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  githubHandle: z.string().min(1, 'GitHub handle is required').max(100),
  // Step 2: Contribution details
  contributionType: z.enum(['Code', 'Documentation', 'Design', 'Translation', 'Other']).default('Code'),
  repository: z.string().min(2, 'Repository is required').max(200),
  scope: z.string().min(5, 'Please describe the scope of your contribution').max(500),
  notes: z.string().max(2000).optional(),
});

export type PrRequestFormData = z.infer<typeof prRequestSchema>;
export type ContributionsFormData = z.infer<typeof contributionsSchema>;

// =============================================================================
// OPEN SOURCE (NEW — Phase 1 expansion)
// =============================================================================

/**
 * Issue Report Schema (2-step: type+description → environment)
 */
export const issueReportSchema = z.object({
  issueType: z.enum(['bug', 'feature', 'docs', 'question']),
  title: z.string().min(5, 'Issue title is required').max(200),
  description: z.string().min(20, 'Please describe the issue').max(5000),
  reproducibility: z.enum(['always', 'sometimes', 'rarely', 'once']).optional(),
  environment: z.string().max(500).optional(),
  labels: z.array(z.string()).optional(),
});

/**
 * Maintainer Application Schema
 */
export const maintainerApplicationSchema = z.object({
  repo: z.string().min(2, 'Repository is required').max(200),
  githubHandle: z.string().min(1, 'GitHub handle is required').max(100),
  motivation: z.string().min(30, 'Please describe your motivation').max(2000),
  contributionHistory: z.string().min(20, 'Describe your contribution history').max(2000),
  availability: z.number().min(1, 'Availability is required').max(40),
  areasOfFocus: z.array(z.string()).min(1, 'Select at least one area'),
});

/**
 * Release Notes Schema
 */
export const releaseNotesSchema = z.object({
  version: z.string().min(1, 'Version is required').max(50),
  releaseType: z.enum(['patch', 'minor', 'major']),
  breakingChanges: z.string().max(2000).optional(),
  features: z.string().max(2000).optional(),
  bugFixes: z.string().max(2000).optional(),
  docs: z.string().max(1000).optional(),
  migrationGuide: z.string().max(3000).optional(),
  publishChannels: z.array(z.string()).min(1, 'Select at least one channel'),
});

/**
 * Community Report Schema
 */
export const communityReportSchema = z.object({
  violationType: z.enum(['harassment', 'spam', 'abuse', 'off_topic', 'other']),
  contentUrl: z.string().url('Must be a valid URL').min(1, 'Content URL is required'),
  description: z.string().min(20, 'Please describe the violation').max(2000),
  anonymous: z.boolean().default(false),
  requestedAction: z.enum(['remove_content', 'warn_user', 'ban_user', 'no_action']).default('remove_content'),
});

export type IssueReportFormData = z.infer<typeof issueReportSchema>;
export type MaintainerApplicationFormData = z.infer<typeof maintainerApplicationSchema>;
export type ReleaseNotesFormData = z.infer<typeof releaseNotesSchema>;
export type CommunityReportFormData = z.infer<typeof communityReportSchema>;
