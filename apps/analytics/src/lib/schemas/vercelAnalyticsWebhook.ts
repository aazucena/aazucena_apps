// apps/analytics/src/lib/schemas/vercelAnalyticsWebhook.ts
import { z } from 'zod';

// Schema for a single log entry from Vercel Log Drain
// This schema matches the standard HTTP access log format provided by Vercel Log Drains
export const VercelLogEntrySchema = z.object({
  id: z.string().optional(),
  timestamp: z.number().optional(), // Unix timestamp in ms
  message: z.string().optional(),
  projectId: z.string().optional(),
  source: z.string().optional(),
  host: z.string().optional(),
  path: z.string().optional(),
  method: z.string().optional(),
  statusCode: z.number().optional(),
  proxy: z.object({
    timestamp: z.number().optional(),
    clientIp: z.string().optional(),
    userAgent: z.array(z.string()).optional(),
    referer: z.string().optional(),
    vercel: z.any().optional(), // Vercel internal metadata
    geo: z.object({
      city: z.string().optional(),
      country: z.string().optional(),
      region: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).optional(),
  }).optional(),
});

// The payload is typically an array of these entries
export const VercelLogDrainPayloadSchema = z.array(VercelLogEntrySchema);

export type VercelLogEntry = z.infer<typeof VercelLogEntrySchema>;
