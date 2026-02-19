// apps/analytics/src/lib/schemas/sentryWebhook.ts
import { z } from 'zod';

// Minimal schema for a Sentry issue event webhook payload
// This focuses on extracting fields relevant to the ClickHouse error_traces table
export const SentryWebhookPayloadSchema = z.object({
  // Sentry's unique identifier for the event
  event_id: z.string().uuid(),
  // Direct link to the issue in Sentry
  url: z.string().url(),
  // Type of event (e.g., error, default, csp, transaction, etc.)
  type: z.string(),
  // Level of the event (e.g., "fatal", "error", "warning", "info", "debug")
  level: z.enum(['fatal', 'error', 'warning', 'info', 'debug']),
  // Short message or title of the error
  message: z.string(),
  // Identifies the likely source of the error (e.g., function name, file path)
  culprit: z.string().optional().nullable(),
  // Information about the Sentry project/issue
  project_slug: z.string(), // Project ID
  issue_id: z.string(), // Sentry's internal issue ID (not the event_id)

  // Release and environment information
  release: z.string().optional().nullable(),
  environment: z.string().optional().nullable(),

  // Contextual information
  tags: z.record(z.string(), z.string()).optional(), // Key-value tags
  user: z
    .object({
      id: z.string().optional().nullable(),
      email: z.string().email().optional().nullable(),
      ip_address: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type SentryWebhookPayload = z.infer<typeof SentryWebhookPayloadSchema>;

// Schema for the data that will be inserted into ClickHouse
export const ErrorTraceClickHouseSchema = z.object({
  timestamp: z.string(), // DateTime('UTC') in ClickHouse
  issue_id: z.string(),
  level: z.enum(['fatal', 'error', 'warning', 'info', 'debug']),
  message: z.string(),
  culprit: z.string().nullable(),
  release: z.string().nullable(),
  environment: z.string().nullable(),
  url: z.string(), // Sentry's issue URL
  user_id: z.string().nullable(),
  tags: z.array(z.string()), // Convert key:value tags to array of strings
  sentry_url: z.string().url(),
});

export type ErrorTraceClickHouse = z.infer<typeof ErrorTraceClickHouseSchema>;
