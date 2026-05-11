import { z } from 'zod';

// =============================================================================
// ANALYTICS (AZUCENA_LYTICS) SCHEMAS
// =============================================================================

/**
 * Demo Request Schema
 */
export const demoRequestSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  useCase: z.string().min(10, 'Please describe your use case').max(1000),
  teamSize: z.enum(['Solo', '2-10', '11-50', '50+']).default('Solo'),
  currentTools: z.string().max(500).optional(),
});

/**
 * API Access Schema (2-step: request + justification)
 */
export const apiAccessSchema = z.object({
  // Step 1: Identity
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  organization: z.string().max(100).optional(),
  // Step 2: Use case
  useCase: z.string().min(20, 'Please describe your use case').max(2000),
  intendedUsage: z.enum(['Personal', 'Commercial', 'Research', 'Education']).default('Personal'),
  expectedVolume: z
    .enum(['< 1k req/day', '1k-100k req/day', '100k+ req/day'])
    .default('< 1k req/day'),
  agreedToTerms: z.boolean().refine((val) => val === true, 'You must agree to the API terms'),
});

/**
 * Alert Config Schema (monitoring alert)
 */
export const alertConfigSchema = z.object({
  alertName: z.string().min(2, 'Alert name is required').max(100),
  metric: z.string().min(1, 'Metric is required'),
  operator: z.enum(['>', '<', '>=', '<=', '==']).default('>'),
  threshold: z.number().min(0, 'Threshold must be non-negative'),
  notificationChannel: z.enum(['Email', 'Slack', 'Webhook']).default('Email'),
  notificationTarget: z.string().min(1, 'Notification target is required').max(500),
  cooldownMinutes: z.number().min(1).max(1440).default(60),
});

/**
 * Custom Report Schema
 */
export const customReportSchema = z.object({
  reportName: z.string().min(2, 'Report name is required').max(100),
  dateRangeStart: z.string().min(1, 'Start date is required'),
  dateRangeEnd: z.string().min(1, 'End date is required'),
  metrics: z.array(z.string()).min(1, 'Select at least one metric'),
  groupBy: z.enum(['Hour', 'Day', 'Week', 'Month']).default('Day'),
  outputFormat: z.enum(['CSV', 'PDF', 'JSON']).default('CSV'),
  email: z.string().email('Invalid email address'),
});

export type DemoRequestFormData = z.infer<typeof demoRequestSchema>;
export type ApiAccessFormData = z.infer<typeof apiAccessSchema>;
export type AlertConfigFormData = z.infer<typeof alertConfigSchema>;
export type CustomReportFormData = z.infer<typeof customReportSchema>;
