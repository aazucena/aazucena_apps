import { z } from 'zod';

// =============================================================================
// PLATFORM / DEVOPS SCHEMAS
// =============================================================================

/**
 * Deployment Trigger Schema (manual deploy request)
 */
export const deploymentTriggerSchema = z.object({
  environment: z.enum(['staging', 'preview', 'production']).default('staging'),
  service: z.string().min(2, 'Service name is required').max(100),
  versionTag: z.string().min(1, 'Version tag is required').max(100),
  deploymentNotes: z.string().max(1000).optional(),
  confirmDeployment: z.boolean().refine((val) => val === true, 'You must confirm the deployment'),
});

/**
 * OAuth Scopes Request Schema (third-party app OAuth registration)
 */
export const oauthScopesSchema = z.object({
  appName: z.string().min(2, 'App name is required').max(100),
  appUrl: z.string().url('Must be a valid URL'),
  redirectUris: z.string().min(1, 'At least one redirect URI is required').max(2000),
  requestedScopes: z.array(z.enum(['read', 'write', 'admin', 'webhooks'])).min(1, 'Select at least one scope'),
  useCase: z.string().min(20, 'Please describe your use case').max(2000),
  company: z.string().max(100).optional(),
  contactEmail: z.string().email('Invalid email address'),
});

/**
 * Incident Post-Mortem Schema (3-step: incident → analysis → resolution)
 */
export const incidentPostMortemSchema = z.object({
  // Step 1: Incident
  title: z.string().min(5, 'Title is required').max(200),
  incidentDate: z.string().min(1, 'Incident date is required'),
  severity: z.enum(['sev1', 'sev2', 'sev3', 'sev4']).default('sev2'),
  affectedServices: z.string().min(2, 'Affected services are required').max(500),
  // Step 2: Analysis
  rootCause: z.string().min(20, 'Root cause analysis is required').max(3000),
  timeline: z.string().min(20, 'Incident timeline is required').max(3000),
  detectionMethod: z.string().min(5, 'Detection method is required').max(500),
  impactSummary: z.string().min(10, 'Impact summary is required').max(2000),
  // Step 3: Resolution
  resolutionSteps: z.string().min(20, 'Resolution steps are required').max(3000),
  actionItems: z.string().min(10, 'Action items are required').max(2000),
  lessonsLearned: z.string().min(10, 'Lessons learned are required').max(2000),
  participants: z.string().min(2, 'At least one participant is required').max(500),
});

export type DeploymentTriggerFormData = z.infer<typeof deploymentTriggerSchema>;
export type OAuthScopesFormData = z.infer<typeof oauthScopesSchema>;
export type IncidentPostMortemFormData = z.infer<typeof incidentPostMortemSchema>;

// =============================================================================
// PLATFORM (NEW — Phase 1 expansion)
// =============================================================================

/**
 * Webhook Config Schema
 */
export const webhookConfigSchema = z.object({
  url: z.string().url('Must be a valid HTTPS URL'),
  events: z.array(z.string()).min(1, 'Select at least one event type'),
  secret: z.string().max(200).optional(),
  retryPolicy: z.enum(['none', '3x', '5x']).default('3x'),
  format: z.enum(['json', 'form']).default('json'),
  sslVerify: z.boolean().default(true),
});

/**
 * Feature Flag Schema
 */
export const featureFlagSchema = z.object({
  flagKey: z.string().min(2, 'Flag key is required').max(100).regex(/^[a-z_]+$/, 'Use lowercase letters and underscores only'),
  displayName: z.string().min(2, 'Display name is required').max(100),
  environment: z.enum(['dev', 'staging', 'prod']).default('dev'),
  enabled: z.boolean().default(false),
  rolloutPercentage: z.number().min(0).max(100).default(0),
  targetGroups: z.array(z.string()).optional(),
  expiresAt: z.string().optional(),
});

/**
 * API Key Rotation Schema
 */
export const apiKeyRotationSchema = z.object({
  keyId: z.string().min(1, 'Key ID is required'),
  rotationReason: z.enum(['routine', 'suspected_compromise', 'employee_offboarding', 'compliance', 'other']),
  gracePeriod: z.enum(['immediate', '24h', '72h', '7d']).default('24h'),
  notifyIntegrations: z.boolean().default(true),
  confirmRotate: z.boolean().refine((v) => v === true, 'You must confirm the key rotation'),
});

/**
 * Environment Variables Schema
 */
export const environmentVariablesSchema = z.object({
  environment: z.enum(['dev', 'staging', 'prod']),
  variables: z.string().min(1, 'Enter at least one variable (KEY=value per line)').max(10000),
  syncTo: z.array(z.string()).optional(),
  overrideExisting: z.boolean().default(false),
});

export type WebhookConfigFormData = z.infer<typeof webhookConfigSchema>;
export type FeatureFlagFormData = z.infer<typeof featureFlagSchema>;
export type ApiKeyRotationFormData = z.infer<typeof apiKeyRotationSchema>;
export type EnvironmentVariablesFormData = z.infer<typeof environmentVariablesSchema>;
