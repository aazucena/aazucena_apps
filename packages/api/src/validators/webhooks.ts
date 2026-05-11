import { z } from 'zod';

export const SentryWebhookPayloadSchema = z.object({
  event_id: z.string().uuid(),
  url: z.string().url(),
  type: z.string(),
  level: z.enum(['fatal', 'error', 'warning', 'info', 'debug']),
  message: z.string(),
  culprit: z.string().optional().nullable(),
  project_slug: z.string(),
  issue_id: z.string(),
  release: z.string().optional().nullable(),
  environment: z.string().optional().nullable(),
  tags: z.record(z.string(), z.string()).optional(),
  user: z
    .object({
      id: z.string().optional().nullable(),
      email: z.string().email().optional().nullable(),
      ip_address: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export const VercelLogEntrySchema = z.object({
  id: z.string().optional(),
  timestamp: z.number().optional(),
  message: z.string().optional(),
  projectId: z.string().optional(),
  source: z.string().optional(),
  host: z.string().optional(),
  path: z.string().optional(),
  method: z.string().optional(),
  statusCode: z.number().optional(),
  proxy: z
    .object({
      timestamp: z.number().optional(),
      clientIp: z.string().optional(),
      userAgent: z.array(z.string()).optional(),
      referer: z.string().optional(),
      vercel: z.any().optional(),
      geo: z
        .object({
          city: z.string().optional(),
          country: z.string().optional(),
          region: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const StripeEventSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  type: z.string(),
  created: z.number(),
  data: z.object({
    object: z.any(),
  }),
});

export const KofiWebhookSchema = z.object({
  message_id: z.string(),
  timestamp: z.string(),
  type: z.string(),
  is_public: z.boolean().optional(),
  from_name: z.string().optional(),
  message: z.string().optional(),
  amount: z.string().or(z.number()),
  currency: z.string(),
  email: z.string().email().optional(),
  url: z.string().url().optional(),
  kofi_transaction_id: z.string().optional(),
  verification_token: z.string().optional(),
});
